// Check permissions and roles in the database
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPermissions() {
  try {
    console.log('Checking roles and permissions...');
    
    // Get all roles
    const roles = await prisma.role.findMany();
    console.log(`\n=== ROLES (${roles.length}) ===`);
    roles.forEach(role => {
      console.log(`- ${role.name}: ${role.description}`);
    });
    
    // Get permissions count for each role
    console.log('\n=== PERMISSIONS COUNT BY ROLE ===');
    for (const role of roles) {
      const count = await prisma.rolePermission.count({
        where: { roleId: role.id }
      });
      console.log(`- ${role.name}: ${count} permissions`);
    }
    
    // Get sample permissions for each role
    for (const role of roles) {
      console.log(`\n=== SAMPLE PERMISSIONS FOR ${role.name} ===`);
      
      const permissions = await prisma.permission.findMany({
        where: {
          rolePermissions: {
            some: {
              roleId: role.id
            }
          }
        },
        take: 10,
        orderBy: {
          action: 'asc'
        }
      });
      
      permissions.forEach(perm => {
        console.log(`- ${perm.action}: ${perm.description || 'No description'}`);
      });
      
      // Show count of permissions by action prefix
      console.log(`\n=== ${role.name} PERMISSIONS BY ACTION TYPE ===`);
      const allRolePermissions = await prisma.permission.findMany({
        where: {
          rolePermissions: {
            some: {
              roleId: role.id
            }
          }
        }
      });
      
      const actionCounts: Record<string, number> = {};
      allRolePermissions.forEach(perm => {
        const actionPrefix = perm.action.split(':')[0];
        actionCounts[actionPrefix] = (actionCounts[actionPrefix] || 0) + 1;
      });
      
      Object.entries(actionCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([action, count]) => {
          console.log(`- ${action}: ${count}`);
        });
    }
    
  } catch (error) {
    console.error('Error checking permissions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPermissions();
