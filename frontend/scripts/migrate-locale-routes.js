// This script helps us understand what files need to be migrated from /app/[locale]/ to /app/
const fs = require('fs');
const path = require('path');

// Using absolute paths for Windows
const sourceDir = path.resolve('D:\\www\\zbase\\frontend\\src\\app\\[locale]');
const targetDir = path.resolve('D:\\www\\zbase\\frontend\\src\\app');

// Function to list all files recursively in a directory
function listFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      listFilesRecursively(filePath, fileList);
    } else {
      fileList.push({
        path: filePath,
        relativePath: path.relative(sourceDir, filePath)
      });
    }
  });
  
  return fileList;
}

// List all files in the source directory
const allFiles = listFilesRecursively(sourceDir);

// Print the list of files to migrate
console.log('Files to migrate:');
allFiles.forEach(file => {
  const targetPath = path.join(targetDir, file.relativePath);
  console.log(`${file.path} -> ${targetPath}`);
});

console.log(`\nTotal files to migrate: ${allFiles.length}`);
