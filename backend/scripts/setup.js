#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

console.log(`${colors.blue}==================================================${colors.reset}`);
console.log(`${colors.blue}ZBase Backend Setup${colors.reset}`);
console.log(`${colors.blue}==================================================${colors.reset}`);

// Check if PostgreSQL URL is configured
console.log(`\n${colors.yellow}Checking database configuration...${colors.reset}`);

const envPath = path.join(__dirname, '..', '.env');
let dbType = 'postgresql';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
  
  if (dbUrlMatch) {
    const dbUrl = dbUrlMatch[1];
    
    if (dbUrl.startsWith('file:')) {
      dbType = 'sqlite';
      console.log(`${colors.green}✓ SQLite database configured${colors.reset}`);
    } else if (dbUrl.startsWith('postgresql:')) {
      console.log(`${colors.green}✓ PostgreSQL database configured${colors.reset}`);
    } else {
      console.log(`${colors.yellow}? Unknown database type. Please ensure your DATABASE_URL is correct.${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}✗ DATABASE_URL not found in .env file${colors.reset}`);
    console.log(`${colors.yellow}Please configure your database connection in the .env file${colors.reset}`);
    process.exit(1);
  }
} catch (error) {
  console.log(`${colors.red}✗ Error reading .env file: ${error.message}${colors.reset}`);
  console.log(`${colors.yellow}Please ensure you have a .env file in the project root${colors.reset}`);
  process.exit(1);
}

// Update schema.prisma if using SQLite
if (dbType === 'sqlite') {
  console.log(`\n${colors.yellow}Updating Prisma schema for SQLite...${colors.reset}`);
  
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  
  try {
    let schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Comment out PostgreSQL datasource
    schemaContent = schemaContent.replace(
      /datasource db {\n  provider = "postgresql"\n  url      = env\("DATABASE_URL"\)\n}/,
      '// datasource db {\n//   provider = "postgresql"\n//   url      = env("DATABASE_URL")\n// }'
    );
    
    // Uncomment SQLite datasource
    schemaContent = schemaContent.replace(
      /\/\/ datasource db {\n\/\/   provider = "sqlite"\n\/\/   url      = env\("DATABASE_URL"\)\n\/\/ }/,
      'datasource db {\n  provider = "sqlite"\n  url      = env("DATABASE_URL")\n}'
    );
    
    fs.writeFileSync(schemaPath, schemaContent);
    console.log(`${colors.green}✓ Prisma schema updated for SQLite${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}✗ Error updating Prisma schema: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run migrations
console.log(`\n${colors.yellow}Running database migrations...${colors.reset}`);

exec('npx prisma migrate dev --name init', (error, stdout, stderr) => {
  if (error) {
    console.log(`${colors.red}✗ Error running migrations: ${error.message}${colors.reset}`);
    console.log(`${colors.yellow}${stderr}${colors.reset}`);
    
    if (dbType === 'postgresql') {
      console.log(`${colors.yellow}If you're having issues with PostgreSQL:${colors.reset}`);
      console.log(`${colors.yellow}1. Make sure PostgreSQL is installed and running${colors.reset}`);
      console.log(`${colors.yellow}2. Create a database named 'zbase': CREATE DATABASE zbase;${colors.reset}`);
      console.log(`${colors.yellow}3. Check your DATABASE_URL in .env file${colors.reset}`);
      console.log(`${colors.yellow}4. Or switch to SQLite by changing the DATABASE_URL to: file:./dev.db${colors.reset}`);
    }
    
    process.exit(1);
  }
  
  console.log(`${colors.green}✓ Database migrations successful${colors.reset}`);
  console.log(stdout);
  
  // Run seeds
  console.log(`\n${colors.yellow}Seeding the database...${colors.reset}`);
  
  exec('npm run db:seed', (error, stdout, stderr) => {
    if (error) {
      console.log(`${colors.red}✗ Error seeding database: ${error.message}${colors.reset}`);
      console.log(`${colors.yellow}${stderr}${colors.reset}`);
      process.exit(1);
    }
    
    console.log(`${colors.green}✓ Database seeded successfully${colors.reset}`);
    console.log(stdout);
    
    console.log(`\n${colors.green}==================================================${colors.reset}`);
    console.log(`${colors.green}Setup completed successfully!${colors.reset}`);
    console.log(`${colors.green}==================================================${colors.reset}`);
    console.log(`\nYou can now start the server with: ${colors.blue}npm run start:dev${colors.reset}`);
    console.log(`API will be available at: ${colors.blue}http://localhost:8000/api${colors.reset}`);
    console.log(`\nDefault accounts:`);
    console.log(`- Admin: ${colors.yellow}admin@example.com${colors.reset} / ${colors.yellow}password${colors.reset}`);
    console.log(`- User: ${colors.yellow}user@example.com${colors.reset} / ${colors.yellow}password${colors.reset}`);
  });
});
