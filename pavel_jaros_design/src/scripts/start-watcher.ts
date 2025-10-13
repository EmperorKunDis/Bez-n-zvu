#!/usr/bin/env tsx
/**
 * Startup script pro Property Watcher
 *
 * Spustí file system watcher, který sleduje složku nemovitosti/
 * a automaticky aktualizuje databázi při změnách.
 *
 * Usage:
 *   bun run watch-properties
 *   # nebo
 *   tsx src/scripts/start-watcher.ts
 */

import { propertyWatcher } from '../lib/property-watcher/watcher';

async function main() {
  console.log('=================================');
  console.log('  Property Management Watcher  ');
  console.log('=================================\n');

  try {
    // Spusť watcher
    await propertyWatcher.start();

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n\n[MAIN] Received SIGINT, shutting down gracefully...');
      await propertyWatcher.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n\n[MAIN] Received SIGTERM, shutting down gracefully...');
      await propertyWatcher.stop();
      process.exit(0);
    });

    // Keep process alive
    console.log('[MAIN] Watcher is running. Press Ctrl+C to stop.\n');

  } catch (error) {
    console.error('[MAIN] ✗ Fatal error:', error);
    process.exit(1);
  }
}

main();
