import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { PropertyData, PropertyDataSchema, PropertyParseError } from '../types/property';

/**
 * Parser pro data.md soubory nemovitostí
 *
 * Očekávaná struktura data.md:
 * # Název nemovitosti (title)
 * ## Podnázev (subtitle)
 * ---
 * ### Hlavní popis
 * Text popisu...
 * ---
 * img.01, img.02, ...
 * ---
 * **5+1** dispozice
 * **520** plocha
 * **2** podlaží
 * ---
 * youtubeURL : https://...
 * ---
 * ### PODROBNÉ INFORMACE
 * | | |
 * |---|---|
 * | **Klíč** | Hodnota |
 * ---
 * googleMap : <iframe...>
 */

export class PropertyMarkdownParser {
  /**
   * Parse data.md soubor a vrať validovaná data
   */
  async parseDataFile(folderPath: string): Promise<PropertyData> {
    try {
      const dataFilePath = path.join(folderPath, 'data.md');

      // Kontrola existence data.md
      try {
        await fs.access(dataFilePath);
      } catch {
        throw new PropertyParseError(`data.md not found in ${folderPath}`);
      }

      // Načtení obsahu
      const content = await fs.readFile(dataFilePath, 'utf-8');

      // Parse markdown (gray-matter podporuje frontmatter, ale my nepoužíváme)
      const parsed = matter(content);
      const lines = parsed.content.split('\n');

      // Extrakce jednotlivých částí
      const title = this.extractTitle(lines);
      const subtitle = this.extractSubtitle(lines);
      const description = this.extractDescription(lines);
      const { disposition, area, floors } = this.extractParameters(lines);
      const details = this.extractDetailsTable(lines);
      const youtubeUrl = this.extractYoutubeUrl(lines);
      const googleMapUrl = this.extractGoogleMapUrl(lines);

      // Načtení obrázků
      const images = await this.getImages(folderPath);

      // Vytvoření property data objektu
      const propertyData: PropertyData = {
        title,
        subtitle,
        address: title, // Title často obsahuje adresu
        price: details['Cena'] || undefined,
        description,
        disposition,
        area,
        floors,
        details,
        images,
        youtubeUrl,
        googleMapUrl,
      };

      // Validace pomocí Zod
      const validated = PropertyDataSchema.parse(propertyData);

      return validated;

    } catch (error) {
      if (error instanceof PropertyParseError) {
        throw error;
      }
      throw new PropertyParseError(
        `Failed to parse data.md in ${folderPath}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Extrahuj title z prvního # nadpisu
   */
  private extractTitle(lines: string[]): string {
    const titleLine = lines.find(line => line.startsWith('# '));
    if (!titleLine) {
      throw new PropertyParseError('Title (# heading) not found');
    }
    return titleLine.replace(/^#\s+/, '').trim();
  }

  /**
   * Extrahuj subtitle z prvního ## nadpisu
   */
  private extractSubtitle(lines: string[]): string {
    const subtitleLine = lines.find(line => line.startsWith('## '));
    if (!subtitleLine) {
      throw new PropertyParseError('Subtitle (## heading) not found');
    }
    return subtitleLine.replace(/^##\s+/, '').trim();
  }

  /**
   * Extrahuj popis - text mezi --- separátory
   */
  private extractDescription(lines: string[]): string {
    let inDescription = false;
    const descriptionLines: string[] = [];

    for (const line of lines) {
      // Začátek popisu - první --- po nadpisech
      if (line.trim() === '---' && !inDescription && descriptionLines.length === 0) {
        inDescription = true;
        continue;
      }

      // Konec popisu - druhý ---
      if (line.trim() === '---' && inDescription) {
        break;
      }

      if (inDescription) {
        // Přidáváme pouze neprázdné řádky a nadpisy (###)
        if (line.trim().length > 0) {
          descriptionLines.push(line.trim());
        }
      }
    }

    if (descriptionLines.length === 0) {
      throw new PropertyParseError('Description not found');
    }

    return descriptionLines.join('\n\n');
  }

  /**
   * Extrahuj parametry (dispozice, plocha, podlaží)
   * Formát: **5+1** dispozice
   */
  private extractParameters(lines: string[]): {
    disposition?: string;
    area?: number;
    floors?: number;
  } {
    const result: { disposition?: string; area?: number; floors?: number } = {};

    for (const line of lines) {
      const trimmed = line.trim();

      // **X** dispozice
      if (trimmed.includes('dispozice')) {
        const match = trimmed.match(/\*\*([^*]+)\*\*/);
        if (match) result.disposition = match[1].trim();
      }

      // **X** plocha
      if (trimmed.includes('plocha')) {
        const match = trimmed.match(/\*\*(\d+)\*\*/);
        if (match) result.area = parseInt(match[1], 10);
      }

      // **X** podlaží
      if (trimmed.includes('podlaží')) {
        const match = trimmed.match(/\*\*(\d+)\*\*/);
        if (match) result.floors = parseInt(match[1], 10);
      }
    }

    return result;
  }

  /**
   * Extrahuj podrobnou tabulku jako key-value objekt
   */
  private extractDetailsTable(lines: string[]): Record<string, string> {
    const details: Record<string, string> = {};
    let inTable = false;

    for (const line of lines) {
      // Začátek tabulky
      if (line.includes('PODROBNÉ INFORMACE') || line.includes('PODROBNE INFORMACE')) {
        inTable = true;
        continue;
      }

      // Konec tabulky
      if (inTable && line.trim() === '---') {
        break;
      }

      // Parse řádku tabulky: | **Key** | Value |
      if (inTable && line.includes('|')) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p.length > 0);
        if (parts.length >= 2) {
          const key = parts[0].replace(/\*\*/g, '').trim();
          const value = parts[1].trim();

          // Skip header řádků
          if (key && value && key !== '---' && value !== '---' && key.length > 1) {
            details[key] = value;
          }
        }
      }
    }

    return details;
  }

  /**
   * Extrahuj YouTube URL
   * Formát: youtubeURL : https://...
   */
  private extractYoutubeUrl(lines: string[]): string | undefined {
    for (const line of lines) {
      if (line.includes('youtubeURL') || line.includes('youtube')) {
        const match = line.match(/https?:\/\/[^\s]+/);
        if (match) return match[0].trim();
      }
    }
    return undefined;
  }

  /**
   * Extrahuj Google Maps iframe
   * Formát: googleMap : <iframe...>
   */
  private extractGoogleMapUrl(lines: string[]): string | undefined {
    for (const line of lines) {
      if (line.includes('googleMap') || line.includes('<iframe')) {
        const match = line.match(/<iframe[^>]*src="([^"]+)"[^>]*>/);
        if (match) return match[1].trim();

        // Pokud je celý iframe na jednom řádku
        if (line.includes('<iframe')) {
          return line.trim();
        }
      }
    }
    return undefined;
  }

  /**
   * Načti všechny obrázky ze složky
   * img00.jpg = hlavní obrázek
   * img01.jpg, img02.jpg, ... = galerie
   */
  private async getImages(folderPath: string): Promise<string[]> {
    try {
      const files = await fs.readdir(folderPath);

      // Filtruj pouze img soubory
      const imageFiles = files
        .filter(file => /^img\d{2}\.(jpg|jpeg|png|webp)$/i.test(file))
        .sort(); // Seřaď podle názvu (img00, img01, img02, ...)

      if (imageFiles.length === 0) {
        throw new PropertyParseError('No images found (img00.jpg required)');
      }

      // Kontrola existence img00.jpg
      if (!imageFiles.some(img => img.toLowerCase().startsWith('img00'))) {
        throw new PropertyParseError('Main image img00.jpg not found');
      }

      return imageFiles;

    } catch (error) {
      throw new PropertyParseError(
        `Failed to read images from ${folderPath}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Validuj že složka obsahuje všechny potřebné soubory
   */
  async validatePropertyFolder(folderPath: string): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Kontrola existence data.md
      try {
        await fs.access(path.join(folderPath, 'data.md'));
      } catch {
        errors.push('data.md file not found');
      }

      // Kontrola existence img00.jpg
      const files = await fs.readdir(folderPath);
      const hasMainImage = files.some(file => file.toLowerCase().startsWith('img00.'));
      if (!hasMainImage) {
        errors.push('Main image img00.jpg not found');
      }

      return {
        valid: errors.length === 0,
        errors,
      };

    } catch (error) {
      errors.push(`Failed to validate folder: ${error instanceof Error ? error.message : String(error)}`);
      return {
        valid: false,
        errors,
      };
    }
  }
}

// Export singleton instance
export const propertyParser = new PropertyMarkdownParser();
