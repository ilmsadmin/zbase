// Migration verification script
const fs = require('fs');
const path = require('path');

// Check if the root app directory has the expected structure
const appDir = path.resolve('D:\\www\\zbase\\frontend\\src\\app');
const localeDir = path.join(appDir, '[locale]');

console.log('Verifying migration status...');

// Check for existence of key directories
console.log('\nChecking directory structure:');
const expectedDirs = ['admin', 'auth', 'dashboard', 'pos', 'profile'];
expectedDirs.forEach(dir => {
  const dirPath = path.join(appDir, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir} directory exists in /app`);
  } else {
    console.log(`❌ ${dir} directory is missing in /app`);
  }
});

// Check if [locale] directory still exists (it should until we're sure migration is complete)
if (fs.existsSync(localeDir)) {
  console.log(`⚠️ [locale] directory still exists (this is expected until migration is complete)`);
} else {
  console.log(`🔄 [locale] directory has been removed`);
}

// Check configuration files
console.log('\nVerifying configuration files:');
const nextConfig = fs.readFileSync(path.resolve('D:\\www\\zbase\\frontend\\next.config.ts'), 'utf8');
if (nextConfig.includes('createNextIntl') && nextConfig.includes('./src/i18n/request.ts')) {
  console.log('✅ next.config.ts is configured correctly');
} else {
  console.log('⚠️ next.config.ts may need review');
}

const middleware = fs.readFileSync(path.resolve('D:\\www\\zbase\\frontend\\src\\middleware.ts'), 'utf8');
if (middleware.includes('getLocale') && middleware.includes('cookies.set')) {
  console.log('✅ middleware.ts is configured correctly');
} else {
  console.log('⚠️ middleware.ts may need review');
}

// Verify LanguageSwitcher
const langSwitcher = fs.readFileSync(path.resolve('D:\\www\\zbase\\frontend\\src\\components\\layouts\\LanguageSwitcher.tsx'), 'utf8');
if (langSwitcher.includes('changeLanguage') && langSwitcher.includes('Cookies.set')) {
  console.log('✅ LanguageSwitcher is configured correctly');
} else {
  console.log('⚠️ LanguageSwitcher may need review');
}

console.log('\nMigration verification complete.');
console.log('Next steps:');
console.log('1. Run the application to test the cookie-based i18n approach');
console.log('2. After confirming everything works correctly, you can remove the [locale] directory');
console.log('3. Update any remaining components that may still reference locale params');
