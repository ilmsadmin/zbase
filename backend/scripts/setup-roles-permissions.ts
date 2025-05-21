// script to set up initial admin and POS roles with required permissions
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Admin permissions - broad system access
const adminPermissions = [
  // User management permissions
  { action: 'create:users', description: 'Create new users' },
  { action: 'read:users', description: 'View all users' },
  { action: 'update:users', description: 'Update user information' },
  { action: 'delete:users', description: 'Delete users' },
  { action: 'manage:users', description: 'Full management of users' },
  
  // Role and permission management
  { action: 'read:roles', description: 'View all roles' },
  { action: 'create:roles', description: 'Create new roles' },
  { action: 'update:roles', description: 'Update roles' },
  { action: 'delete:roles', description: 'Delete roles' },
  { action: 'manage:roles', description: 'Full management of roles' },
  { action: 'read:permissions', description: 'View all permissions' },
  { action: 'assign:permissions', description: 'Assign permissions to roles' },
    // Warehouse management
  { action: 'warehouses.create', description: 'Create warehouses' },
  { action: 'warehouses.read', description: 'View all warehouses' },
  { action: 'warehouses.update', description: 'Update warehouses' },
  { action: 'warehouses.delete', description: 'Delete warehouses' },
  { action: 'warehouses.manage', description: 'Full management of warehouses' },
  { action: 'warehouse-locations.create', description: 'Create warehouse locations' },
  { action: 'warehouse-locations.read', description: 'View all locations' },
  { action: 'warehouse-locations.update', description: 'Update locations' },
  { action: 'warehouse-locations.delete', description: 'Delete locations' },
  { action: 'warehouse-locations.manage', description: 'Full management of warehouse locations' },
  
  // Product management
  { action: 'products.create', description: 'Create products' },
  { action: 'products.read', description: 'View all products' },
  { action: 'products.update', description: 'Update products' },
  { action: 'products.delete', description: 'Delete products' },
  { action: 'products.manage', description: 'Full management of products' },
  { action: 'product-categories.create', description: 'Create product categories' },  { action: 'product-categories.read', description: 'View all categories' },
  { action: 'product-categories.update', description: 'Update categories' },
  { action: 'product-categories.delete', description: 'Delete categories' },
  { action: 'product-attributes.create', description: 'Create product attributes' },
  { action: 'product-attributes.read', description: 'View product attributes' },
  { action: 'product-attributes.update', description: 'Update product attributes' },
  { action: 'product-attributes.delete', description: 'Delete product attributes' },
  { action: 'product-attributes.manage', description: 'Full management of product attributes' },
  
  // Inventory management
  { action: 'create:inventory', description: 'Create inventory records' },
  { action: 'read:inventory', description: 'View inventory records' },
  { action: 'update:inventory', description: 'Update inventory records' },
  { action: 'delete:inventory', description: 'Delete inventory records' },
  { action: 'manage:inventory', description: 'Full management of inventory' },
  { action: 'create:inventory_transactions', description: 'Create inventory transactions' },
  { action: 'read:inventory_transactions', description: 'View inventory transactions' },
  
  // Customer management
  { action: 'create:customers', description: 'Create customers' },
  { action: 'read:customers', description: 'View all customers' },
  { action: 'update:customers', description: 'Update customers' },
  { action: 'delete:customers', description: 'Delete customers' },
  { action: 'manage:customers', description: 'Full management of customers' },
  { action: 'create:customer_groups', description: 'Create customer groups' },
  { action: 'read:customer_groups', description: 'View all customer groups' },
  { action: 'update:customer_groups', description: 'Update customer groups' },
  { action: 'delete:customer_groups', description: 'Delete customer groups' },
  
  // Partner management
  { action: 'create:partners', description: 'Create partners' },
  { action: 'read:partners', description: 'View all partners' },
  { action: 'update:partners', description: 'Update partners' },
  { action: 'delete:partners', description: 'Delete partners' },
  { action: 'manage:partners', description: 'Full management of partners' },
  
  // Sales management
  { action: 'create:invoices', description: 'Create invoices' },
  { action: 'read:invoices', description: 'View all invoices' },
  { action: 'update:invoices', description: 'Update invoices' },
  { action: 'delete:invoices', description: 'Delete invoices' },
  { action: 'manage:invoices', description: 'Full management of invoices' },
  { action: 'void:invoices', description: 'Void invoices' },
  
  // POS management
  { action: 'create:shifts', description: 'Create shifts' },
  { action: 'read:shifts', description: 'View all shifts' },
  { action: 'update:shifts', description: 'Update shifts' },
  { action: 'delete:shifts', description: 'Delete shifts' },
  { action: 'manage:shifts', description: 'Full management of shifts' },
  { action: 'open:shift', description: 'Open a shift' },
  { action: 'close:shift', description: 'Close a shift' },
  
  // Price and Promotion management
  { action: 'create:pricelists', description: 'Create price lists' },
  { action: 'read:pricelists', description: 'View all price lists' },
  { action: 'update:pricelists', description: 'Update price lists' },
  { action: 'delete:pricelists', description: 'Delete price lists' },
  { action: 'manage:pricelists', description: 'Full management of price lists' },
  
  // Transaction management
  { action: 'create:transactions', description: 'Create financial transactions' },
  { action: 'read:transactions', description: 'View all transactions' },
  { action: 'update:transactions', description: 'Update transactions' },
  { action: 'delete:transactions', description: 'Delete transactions' },
  { action: 'manage:transactions', description: 'Full management of transactions' },
  
  // Warranty management
  { action: 'create:warranties', description: 'Create warranty records' },
  { action: 'read:warranties', description: 'View all warranty records' },
  { action: 'update:warranties', description: 'Update warranty records' },
  { action: 'delete:warranties', description: 'Delete warranty records' },
  { action: 'manage:warranties', description: 'Full management of warranties' },
  
  // Report management
  { action: 'create:reports', description: 'Create reports' },
  { action: 'read:reports', description: 'View all reports' },
  { action: 'update:reports', description: 'Update reports' },
  { action: 'delete:reports', description: 'Delete reports' },
  { action: 'manage:reports', description: 'Full management of reports' },
  
  // System management
  { action: 'access:admin', description: 'Access admin panel' },
  { action: 'access:pos', description: 'Access POS system' },
  { action: 'manage:system', description: 'Full system management' },
  { action: 'configure:system', description: 'Configure system settings' },
];

// POS permissions - limited to sales operations
const posPermissions = [
  // Limited user management
  { action: 'read:users', description: 'View all users' },
  
  // Warehouse access (read only)
  { action: 'read:warehouses', description: 'View all warehouses' },
  { action: 'read:locations', description: 'View all locations' },
    // Product access
  { action: 'products.read', description: 'View all products' },
  { action: 'product-categories.read', description: 'View all categories' },
  { action: 'product-attributes.read', description: 'View product attributes' },
  
  // Inventory access (read only)
  { action: 'read:inventory', description: 'View inventory records' },
  
  // Customer management
  { action: 'create:customers', description: 'Create customers' },
  { action: 'read:customers', description: 'View all customers' },
  { action: 'update:customers', description: 'Update customers' },
  { action: 'read:customer_groups', description: 'View all customer groups' },
  
  // Sales management
  { action: 'create:invoices', description: 'Create invoices' },
  { action: 'read:invoices', description: 'View all invoices' },
  { action: 'void:invoices', description: 'Void invoices' },
  
  // POS operations
  { action: 'open:shift', description: 'Open a shift' },
  { action: 'close:shift', description: 'Close a shift' },
  { action: 'read:shifts', description: 'View all shifts' },
  
  // Price list access
  { action: 'read:pricelists', description: 'View all price lists' },
  
  // Transaction management (limited)
  { action: 'create:transactions', description: 'Create financial transactions' },
  { action: 'read:transactions', description: 'View all transactions' },
  
  // Warranty management
  { action: 'create:warranties', description: 'Create warranty records' },
  { action: 'read:warranties', description: 'View all warranty records' },
  { action: 'update:warranties', description: 'Update warranty records' },
  
  // Reports (read only)
  { action: 'read:reports', description: 'View all reports' },
  
  // System access
  { action: 'access:pos', description: 'Access POS system' },
];

async function createPermission(action: string, description: string) {
  const existingPermission = await prisma.permission.findUnique({
    where: { action },
  });

  if (existingPermission) {
    console.log(`Permission already exists: ${action}`);
    return existingPermission;
  }

  const permission = await prisma.permission.create({
    data: { action, description },
  });
  console.log(`Created permission: ${action}`);
  return permission;
}

async function createRoleWithPermissions(name: string, description: string, permissionsList: Array<{ action: string, description: string }>) {
  // Find or create the role
  let role = await prisma.role.findUnique({
    where: { name },
  });

  if (!role) {
    role = await prisma.role.create({
      data: { name, description },
    });
    console.log(`Created role: ${name}`);
  } else {
    console.log(`Role already exists: ${name}`);
  }

  // Create permissions and assign them to the role
  for (const permissionData of permissionsList) {
    const permission = await createPermission(permissionData.action, permissionData.description);

    // Check if the role already has this permission
    const existingRolePermission = await prisma.rolePermission.findFirst({
      where: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });

    if (!existingRolePermission) {
      await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
      console.log(`Assigned permission ${permission.action} to role ${role.name}`);
    } else {
      console.log(`Permission ${permission.action} already assigned to role ${role.name}`);
    }
  }

  return role;
}

async function main() {
  try {
    console.log('STARTING setup of admin and POS roles permissions...');
    
    console.log('Setting up admin role and permissions...');
    await createRoleWithPermissions(
      'ADMIN',
      'Full system administrator with complete access to all features',
      adminPermissions
    );

    console.log('Setting up POS role and permissions...');
    await createRoleWithPermissions(
      'POS',
      'Point of sale operator with access to sales and customer management features',
      posPermissions
    );

    console.log('Setup completed successfully');
  } catch (error) {
    console.error('Error during setup:', error);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

main();
