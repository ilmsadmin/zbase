#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Installing Facebook Integration packages...\n');

// Packages to install
const packages = [
  '@nestjs/axios', // For HTTP requests to Facebook Graph API
  'axios', // HTTP client
  'passport-facebook', // Facebook OAuth strategy
  'node-fetch' // Alternative HTTP client for Graph API
];

const devPackages = [
  '@types/passport-facebook', // TypeScript types for passport-facebook
  '@types/node-fetch' // TypeScript types for node-fetch
];

try {
  // Install production packages
  console.log('📦 Installing production packages...');
  execSync(`npm install ${packages.join(' ')}`, { stdio: 'inherit' });
  
  // Install dev packages
  console.log('\n📦 Installing development packages...');
  execSync(`npm install --save-dev ${devPackages.join(' ')}`, { stdio: 'inherit' });
  
  console.log('\n✅ All Facebook integration packages installed successfully!');
  
  // Read current package.json to show what was added
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  console.log('\n📋 Added packages:');
  console.log('\nProduction dependencies:');
  packages.forEach(pkg => {
    if (packageJson.dependencies[pkg]) {
      console.log(`  ✓ ${pkg}@${packageJson.dependencies[pkg]}`);
    }
  });
  
  console.log('\nDevelopment dependencies:');
  devPackages.forEach(pkg => {
    if (packageJson.devDependencies[pkg]) {
      console.log(`  ✓ ${pkg}@${packageJson.devDependencies[pkg]}`);
    }
  });
  
  console.log('\n🎯 Next steps:');
  console.log('1. Set up Facebook App in Meta Developers Console');
  console.log('2. Add Facebook environment variables to .env');
  console.log('3. Implement Facebook module following the design document');
  console.log('4. Configure OAuth redirect URLs');
  
} catch (error) {
  console.error('❌ Error installing packages:', error.message);
  process.exit(1);
}
