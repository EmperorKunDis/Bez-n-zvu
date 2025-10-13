import chokidar, { FSWatcher } from 'chokidar';
import path from 'path';
import { Status } from '@prisma/client';
import {
  getStatusFromPath,
  getFolderIdFromPath,
  PropertyValidationError,
} from '../types/property';
import { propertyParser } from './parser';
import { propertyDb } from './db';

/**
 * File System Watcher pro správu nemovitostí
 *
 * Sleduje složky nemovitosti/Prodej, nemovitosti/Pronajem, nemovitosti/Hotovo
 * a automaticky aktualizuje databázi při změnách.
 */
export class PropertyWatcher {
  private watcher: FSWatcher | null = null;
  private baseDir: string;
  private pendingMoves: Map<string, { folderId: string; fromStatus: Status; timeout: NodeJS.Timeout }> = new Map();
  private readonly MOVE_DEBOUNCE_MS = 1000; // Čekání na dokončení přesunu

  constructor(baseDir: string = './nemovitosti') {
    this.baseDir = path.resolve(baseDir);
  }

  /**
   * Spusť watcher
   */
  async start(): Promise<void> {
    console.log('[WATCHER] Starting Property Watcher...');
    console.log(`[WATCHER] Watching directory: ${this.baseDir}`);

    // Inicializace - načti existující složky
    await this.initializeExistingProperties();

    // Spusť watcher
    this.watcher = chokidar.watch(this.baseDir, {
      ignored: /(^|[\/\\])\../, // Ignoruj hidden files
      persistent: true,
      ignoreInitial: false,
      depth: 3, // nemovitosti/Status/FolderId
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100,
      },
    });

    // Event handlers
    this.watcher
      .on('addDir', (dirPath) => this.handleAddDir(dirPath))
      .on('unlinkDir', (dirPath) => this.handleUnlinkDir(dirPath))
      .on('change', (filePath) => this.handleChange(filePath))
      .on('error', (error) => console.error('[WATCHER] Error:', error))
      .on('ready', () => {
        console.log('[WATCHER] ✓ Ready - monitoring for changes');
      });
  }

  /**
   * Zastav watcher
   */
  async stop(): Promise<void> {
    console.log('[WATCHER] Stopping...');
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
    }
    console.log('[WATCHER] ✓ Stopped');
  }

  /**
   * Načti existující nemovitosti při startu
   */
  private async initializeExistingProperties(): Promise<void> {
    console.log('[WATCHER] Initializing existing properties...');

    try {
      const fs = await import('fs/promises');

      for (const statusFolder of ['Prodej', 'Pronajem', 'Hotovo']) {
        const statusPath = path.join(this.baseDir, statusFolder);

        try {
          const folders = await fs.readdir(statusPath, { withFileTypes: true });

          for (const folder of folders) {
            if (folder.isDirectory()) {
              const folderPath = path.join(statusPath, folder.name);
              await this.processNewProperty(folderPath);
            }
          }
        } catch (error) {
          // Složka možná neexistuje, to je OK
          console.log(`[WATCHER] Status folder ${statusFolder} not found, skipping...`);
        }
      }

      console.log('[WATCHER] ✓ Initialization complete');

    } catch (error) {
      console.error('[WATCHER] ✗ Failed to initialize:', error);
    }
  }

  /**
   * Handler: Nová složka vytvořena
   */
  private async handleAddDir(dirPath: string): Promise<void> {
    // Ignoruj root složky (nemovitosti, nemovitosti/Prodej, ...)
    if (this.isRootOrStatusFolder(dirPath)) {
      return;
    }

    console.log(`[WATCHER] → New directory detected: ${dirPath}`);

    const folderId = getFolderIdFromPath(dirPath);
    const status = getStatusFromPath(dirPath);

    if (!status) {
      console.warn(`[WATCHER] ⚠ Invalid path structure: ${dirPath}`);
      return;
    }

    // Kontrola zda to není dokončení přesunu
    if (this.pendingMoves.has(dirPath)) {
      const moveInfo = this.pendingMoves.get(dirPath)!;
      clearTimeout(moveInfo.timeout);
      this.pendingMoves.delete(dirPath);

      console.log(`[WATCHER] ↔ Detected move: ${folderId} (${moveInfo.fromStatus} → ${status})`);
      await this.processPropertyMove(folderId, moveInfo.fromStatus, status);
      return;
    }

    // Nová nemovitost
    await this.processNewProperty(dirPath);
  }

  /**
   * Handler: Složka smazána
   */
  private async handleUnlinkDir(dirPath: string): Promise<void> {
    // Ignoruj root složky
    if (this.isRootOrStatusFolder(dirPath)) {
      return;
    }

    console.log(`[WATCHER] → Directory removed: ${dirPath}`);

    const folderId = getFolderIdFromPath(dirPath);
    const status = getStatusFromPath(dirPath);

    if (!status) {
      console.warn(`[WATCHER] ⚠ Invalid path structure: ${dirPath}`);
      return;
    }

    // Může to být začátek přesunu - počkej chvíli
    const timeout = setTimeout(async () => {
      // Pokud po timeoutu stále není addDir event, jedná se o skutečné smazání
      console.log(`[WATCHER] ✗ Property deleted: ${folderId}`);
      await propertyDb.deleteProperty(folderId);
      this.pendingMoves.delete(dirPath);
    }, this.MOVE_DEBOUNCE_MS);

    this.pendingMoves.set(dirPath, { folderId, fromStatus: status, timeout });
  }

  /**
   * Handler: Soubor změněn (např. data.md nebo obrázek)
   */
  private async handleChange(filePath: string): Promise<void> {
    // Pouze pro data.md a obrázky
    const fileName = path.basename(filePath);

    if (fileName === 'data.md' || /^img\d{2}\.(jpg|jpeg|png|webp)$/i.test(fileName)) {
      console.log(`[WATCHER] → File changed: ${filePath}`);

      const folderPath = path.dirname(filePath);
      const folderId = getFolderIdFromPath(folderPath);

      // Kontrola existence v DB
      const exists = await propertyDb.propertyExists(folderId);

      if (exists) {
        console.log(`[WATCHER] ↻ Updating property: ${folderId}`);
        await this.processPropertyUpdate(folderPath);
      } else {
        // Pokud neexistuje, vytvoř (např. pokud byla složka vytvořena dříve než soubory)
        console.log(`[WATCHER] + Creating property (late init): ${folderId}`);
        await this.processNewProperty(folderPath);
      }
    }
  }

  /**
   * Zpracuj novou nemovitost
   */
  private async processNewProperty(folderPath: string): Promise<void> {
    try {
      const folderId = getFolderIdFromPath(folderPath);
      const status = getStatusFromPath(folderPath);

      if (!status) {
        console.error(`[WATCHER] ✗ Invalid path for new property: ${folderPath}`);
        return;
      }

      // Kontrola zda už neexistuje
      const exists = await propertyDb.propertyExists(folderId);
      if (exists) {
        console.log(`[WATCHER] ⚠ Property ${folderId} already exists, skipping...`);
        return;
      }

      // Validuj složku
      const validation = await propertyParser.validatePropertyFolder(folderPath);
      if (!validation.valid) {
        console.error(`[WATCHER] ✗ Invalid property folder ${folderId}:`, validation.errors);
        return;
      }

      // Parse data.md
      const data = await propertyParser.parseDataFile(folderPath);

      // Vytvoř v databázi
      await propertyDb.createProperty({
        folderId,
        status,
        data,
      });

      console.log(`[WATCHER] ✓ Property created: ${folderId} (${status})`);

    } catch (error) {
      if (error instanceof PropertyValidationError) {
        console.error(`[WATCHER] ✗ Validation error:`, error.message);
      } else {
        console.error(`[WATCHER] ✗ Failed to process new property:`, error);
      }
    }
  }

  /**
   * Zpracuj update nemovitosti
   */
  private async processPropertyUpdate(folderPath: string): Promise<void> {
    try {
      const folderId = getFolderIdFromPath(folderPath);

      // Parse data.md
      const data = await propertyParser.parseDataFile(folderPath);

      // Update v databázi
      await propertyDb.updateProperty({
        folderId,
        data,
      });

      console.log(`[WATCHER] ✓ Property updated: ${folderId}`);

    } catch (error) {
      console.error(`[WATCHER] ✗ Failed to update property:`, error);
    }
  }

  /**
   * Zpracuj přesunutí nemovitosti (změna statusu)
   */
  private async processPropertyMove(folderId: string, fromStatus: Status, toStatus: Status): Promise<void> {
    try {
      await propertyDb.moveProperty(folderId, toStatus);
      console.log(`[WATCHER] ✓ Property moved: ${folderId} (${fromStatus} → ${toStatus})`);

    } catch (error) {
      console.error(`[WATCHER] ✗ Failed to move property:`, error);
    }
  }

  /**
   * Kontrola zda je cesta root nebo status složka
   */
  private isRootOrStatusFolder(dirPath: string): boolean {
    const relative = path.relative(this.baseDir, dirPath);
    const parts = relative.split(path.sep);

    // Root: nemovitosti
    if (parts.length === 0 || parts[0] === '') {
      return true;
    }

    // Status folder: nemovitosti/Prodej
    if (parts.length === 1 && ['Prodej', 'Pronajem', 'Hotovo'].includes(parts[0])) {
      return true;
    }

    return false;
  }
}

// Export singleton instance
export const propertyWatcher = new PropertyWatcher();
