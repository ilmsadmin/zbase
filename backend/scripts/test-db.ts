// Simple test for database connection
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing database connection...');
    
    // Get all roles - simplest query
    const roleCount = await prisma.role.count();
    console.log(`Found ${roleCount} roles in database`);
    
    if (roleCount > 0) {
      const roles = await prisma.role.findMany();
      console.log('Roles:', roles.map(r => r.name).join(', '));
    }
    
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => {
  console.error('Uncaught error:', e);
  process.exit(1);
});
