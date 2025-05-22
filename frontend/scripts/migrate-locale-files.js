const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Source and destination directories - use absolute paths for Windows
const srcRoot = path.resolve('D:\\www\\zbase\\frontend\\src\\app\\[locale]');
const destRoot = path.resolve('D:\\www\\zbase\\frontend\\src\\app');

/**
 * Process file content to update locale-related code
 */
async function processFileContent(content) {
  // Replace useParams import and usage
  content = content.replace(
    /import\s+{\s*useParams\s*}\s*from\s*['"]next\/navigation['"]/g,
    '// Removed useParams import for locale migration'
  );
  
  // Replace locale parameter extraction
  content = content.replace(
    /const\s+params\s*=\s*useParams\(\);[\r\n\s]*const\s+currentLocale\s*=\s*params\.locale\s*as\s*string;/g,
    '// Locale is now handled via cookies'
  );
  
  // Remove locale prop passing to LandingPage component
  content = content.replace(
    /<LandingPage locale={currentLocale} \/>/g,
    '<LandingPage />'
  );
  
  // Additional replacements for locale props
  content = content.replace(/locale={currentLocale}/g, '/* locale prop removed */');
  
  return content;
}

/**
 * Recursively copy files from source to destination with content processing
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
      // Recursively process subdirectories
      await copyFiles(srcPath, destPath);
    } else {
      // Only copy if file doesn't already exist in destination
      if (!fs.existsSync(destPath)) {
        // Read file content
        const content = await readFile(srcPath, 'utf8');
        
        // Process content for .tsx and .ts files
        if (srcPath.endsWith('.tsx') || srcPath.endsWith('.ts')) {
          const processedContent = await processFileContent(content);
          await writeFile(destPath, processedContent);
          console.log(`Processed and migrated: ${srcPath} -> ${destPath}`);
        } else {
          // For other file types, just copy without processing
          await copyFile(srcPath, destPath);
          console.log(`Copied: ${srcPath} -> ${destPath}`);
        }
      } else {
        console.log(`Skipped existing file: ${destPath}`);
      }
    }
  }
}

async function main() {
  try {
    console.log('Starting migration of files from [locale] structure to root structure...');
    
    // Count files to migrate for tracking progress
    let count = 0;
    const countFiles = async (dir) => {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          await countFiles(path.join(dir, entry.name));
        } else {
          count++;
        }
      }
    };
    await countFiles(srcRoot);
    console.log(`Found ${count} files to process`);
    
    // Start the migration
    await copyFiles(srcRoot, destRoot);
    
    console.log('\nMigration complete. Next steps:');
    console.log('1. Check the migrated files for any issues');
    console.log('2. Update import paths if needed');
    console.log('3. Manually fix any remaining locale-related code');
    console.log('4. Remove [locale] directory structure once everything is working');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

main();
