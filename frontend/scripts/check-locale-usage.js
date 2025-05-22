// Migration script to update imports and usage of locale-based components
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Target directory - all migrated files in the app folder
const targetDir = path.resolve('D:\\www\\zbase\\frontend\\src\\app');

// Function to update imports in a file
async function updateImports(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    let updated = content;
    let hasChanges = false;
    
    // Check for imports from the Link component
    if (content.includes('import { Link }') && content.includes('from "@/i18n/navigation"')) {
      console.log(`Processing imports in: ${filePath}`);
      hasChanges = true;
    }
    
    // Check for useTranslations import
    if (content.includes('import { useTranslations }') && content.includes('from "next-intl"')) {
      console.log(`Processing useTranslations in: ${filePath}`);
      hasChanges = true;
    }
    
    // Check for useParams for locale extraction
    if (content.includes('useParams') && content.includes('params.locale')) {
      console.log(`Found locale params usage in: ${filePath}`);
      updated = updated.replace(
        /const\s+params\s*=\s*useParams\(\);[\r\n\s]*const\s+currentLocale\s*=\s*params\.locale\s*as\s*string;/g,
        '// Locale is now handled via cookies'
      );
      hasChanges = true;
    }
    
    // If we found any issues, write the updated content
    if (hasChanges) {
      await writeFile(filePath, updated);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Process all files in a directory recursively
async function processDirectory(dir) {
  let updatedFiles = 0;
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and .next
        if (entry.name !== 'node_modules' && entry.name !== '.next') {
          updatedFiles += await processDirectory(fullPath);
        }
      } else if (entry.isFile() && 
                (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        // Process TypeScript files
        if (await updateImports(fullPath)) {
          updatedFiles++;
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
  }
  
  return updatedFiles;
}

async function main() {
  console.log('Starting migration check...');
  console.log(`Target directory: ${targetDir}`);
  
  try {
    const files = await readdir(targetDir);
    console.log(`Found ${files.length} entries in target directory`);
  } catch (error) {
    console.error(`Error reading target directory: ${error.message}`);
  }
  
  const updatedFiles = await processDirectory(targetDir);
  console.log(`\nCompleted! Checked ${updatedFiles} files.`);
}

main();
