const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Using absolute paths for Windows
const srcDir = path.resolve('D:\\www\\zbase\\frontend\\src');

// Regular expression to match Link components with locale prop
const linkWithLocalePropRegex = /(<Link[^>]*?)locale={[^}]*?}([^>]*?>)/g;

// Process a file to remove locale props from Link components
async function processFile(filePath) {
  try {
    // Read file content
    const content = await readFile(filePath, 'utf8');
    
    // Skip if no Link components with locale props
    if (!linkWithLocalePropRegex.test(content)) {
      return false;
    }
    
    console.log(`Found Link components with locale prop in: ${filePath}`);
    
    // Replace Link components with locale props
    const updatedContent = content.replace(linkWithLocalePropRegex, '$1$2');
    
    // Write updated content
    await writeFile(filePath, updatedContent);
    
    console.log(`Updated Link components in: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Recursively process files in directory
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
        if (await processFile(fullPath)) {
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
  console.log('Starting to update Link components...');
  const updatedFiles = await processDirectory(srcDir);
  console.log(`\nCompleted! Updated ${updatedFiles} files.`);
}

main();
