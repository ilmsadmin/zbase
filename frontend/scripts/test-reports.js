#!/usr/bin/env node

/**
 * Script to run specific tests for the reports module
 * This allows us to run just the reports tests rather than all project tests
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the project root directory
const projectRoot = path.resolve(__dirname, '../../');

// Available test suites
const TEST_SUITES = {
  ALL: 'all',
  API: 'api',
  PAGES: 'pages',
  UTILS: 'utils',
};

// Get the test suite to run from command line arguments
const args = process.argv.slice(2);
const testSuite = args[0] || TEST_SUITES.ALL;
const watchMode = args.includes('--watch');

// Function to run tests with proper output
function runTests(testPattern, description) {
  console.log(`\n=== Running ${description} tests ===\n`);
  
  try {
    const command = `jest ${testPattern} ${watchMode ? '--watch' : ''}`;
    execSync(command, { stdio: 'inherit', cwd: projectRoot });
    return true;
  } catch (error) {
    console.error(`\n❌ ${description} tests failed\n`);
    if (!watchMode) {
      return false;
    }
    return true;
  }
}

// Main function
async function main() {
  console.log('🧪 Running Reports Module Tests');
  
  let success = true;
  
  switch (testSuite) {
    case TEST_SUITES.API:
      success = runTests('src/lib/api/services/report.test.ts', 'Report API');
      break;
    
    case TEST_SUITES.PAGES:
      success = runTests('src/app/\\[locale\\]/admin/reports/**/*.test.tsx', 'Report Pages');
      break;
    
    case TEST_SUITES.UTILS:
      success = runTests('src/lib/utils/(chart-optimization|report-sharing).test.ts', 'Report Utilities');
      break;
    
    case TEST_SUITES.ALL:
    default:
      const apiSuccess = runTests('src/lib/api/services/report.test.ts', 'Report API');
      const pagesSuccess = runTests('src/app/\\[locale\\]/admin/reports/**/*.test.tsx', 'Report Pages');
      const utilsSuccess = runTests('src/lib/utils/(chart-optimization|report-sharing).test.ts', 'Report Utilities');
      
      success = apiSuccess && pagesSuccess && utilsSuccess;
      break;
  }
  
  if (success) {
    console.log('\n✅ All tests completed successfully\n');
    process.exit(0);
  } else {
    console.error('\n❌ Some tests failed\n');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});
