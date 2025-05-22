const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

// Source and destination directories
const srcRoot = path.join(__dirname, '../src/app/[locale]');
const destRoot = path.join(__dirname, '../src/app');

/**
 * Recursively copy files from source to destination
 */
async function copyFiles(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    await mkdir(dest, { recursive: true });
  }

  // Read source directory
  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Skip page.tsx files - they should be manually migrated
      await copyFiles(srcPath, destPath);
    } else {
      // Only copy if file doesn't already exist in destination
      if (!fs.existsSync(destPath)) {
        await copyFile(srcPath, destPath);
        console.log(`Copied: ${srcPath} -> ${destPath}`);
      } else {
        console.log(`Skipped existing file: ${destPath}`);
      }
    }
  }
}

async function main() {
  try {
    console.log('Starting migration of files from [locale] structure to root structure...');
    await copyFiles(srcRoot, destRoot);
    console.log('\nMigration complete. Next steps:');
    console.log('1. Check the migrated files for any issues');
    console.log('2. Update import paths if needed');
    console.log('3. Remove [locale] directory structure once everything is working');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

main();
