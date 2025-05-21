// filepath: d:\www\zbase\backend\src\scripts\create-report-dirs.js
/**
 * Create necessary directories for the Reports module
 */
const fs = require('fs');
const path = require('path');

const dirs = [
  './uploads',
  './uploads/reports',
  './generated-reports'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  } else {
    console.log(`Directory exists: ${dir}`);
  }
});

console.log('All report directories created successfully!');
