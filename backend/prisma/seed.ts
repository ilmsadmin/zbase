// Prisma seed file for zBase system
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
  { action: 'product-categories.create', description: 'Create product categories' },
  { action: 'product-categories.read', description: 'View all categories' },
  { action: 'product-categories.update', description: 'Update categories' },
  { action: 'product-categories.delete', description: 'Delete categories' },
  { action: 'product-attributes.create', description: 'Create product attributes' },
  { action: 'product-attributes.read', description: 'View product attributes' },
  { action: 'product-attributes.update', description: 'Update product attributes' },
  { action: 'product-attributes.delete', description: 'Delete product attributes' },
  { action: 'product-attributes.manage', description: 'Full management of product attributes' },
  
  // Inventory management
  { action: 'inventory.create', description: 'Create inventory records' },
  { action: 'inventory.read', description: 'View inventory records' },
  { action: 'inventory.update', description: 'Update inventory records' },
  { action: 'inventory.delete', description: 'Delete inventory records' },
  { action: 'inventory.manage', description: 'Full management of inventory' },
  { action: 'inventory-transactions.create', description: 'Create inventory transactions' },
  { action: 'inventory-transactions.read', description: 'View inventory transactions' },
  { action: 'inventory-transactions.update', description: 'Update inventory transactions' },
  { action: 'inventory-transactions.delete', description: 'Delete inventory transactions' },
  
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
  { action: 'manage:customer_groups', description: 'Full management of customer groups' },
  
  // Sales management
  { action: 'create:invoices', description: 'Create invoices' },
  { action: 'read:invoices', description: 'View all invoices' },
  { action: 'update:invoices', description: 'Update invoices' },
  { action: 'delete:invoices', description: 'Delete invoices' },
  { action: 'void:invoices', description: 'Void invoices' },
  { action: 'manage:invoices', description: 'Full management of invoices' },
  
  // POS operations
  { action: 'open:shift', description: 'Open a shift' },
  { action: 'close:shift', description: 'Close a shift' },
  { action: 'read:shifts', description: 'View all shifts' },
  { action: 'manage:shifts', description: 'Full management of shifts' },
  
  // Price list management
  { action: 'create:pricelists', description: 'Create price lists' },
  { action: 'read:pricelists', description: 'View all price lists' },
  { action: 'update:pricelists', description: 'Update price lists' },
  { action: 'delete:pricelists', description: 'Delete price lists' },
  { action: 'manage:pricelists', description: 'Full management of price lists' },
  
  // Partner management
  { action: 'create:partners', description: 'Create partners' },
  { action: 'read:partners', description: 'View all partners' },
  { action: 'update:partners', description: 'Update partners' },
  { action: 'delete:partners', description: 'Delete partners' },
  { action: 'manage:partners', description: 'Full management of partners' },
  
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
  
  // Reports management
  { action: 'create:reports', description: 'Create reports' },
  { action: 'read:reports', description: 'View all reports' },
  { action: 'update:reports', description: 'Update reports' },
  { action: 'delete:reports', description: 'Delete reports' },
  { action: 'manage:reports', description: 'Full management of reports' },
  { action: 'export:reports', description: 'Export reports' },
  
  // System access
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
  { action: 'warehouses.read', description: 'View all warehouses' },
  { action: 'warehouse-locations.read', description: 'View all locations' },
  
  // Product access
  { action: 'products.read', description: 'View all products' },
  { action: 'product-categories.read', description: 'View all categories' },
  { action: 'product-attributes.read', description: 'View product attributes' },
  
  // Inventory access (read only)
  { action: 'inventory.read', description: 'View inventory records' },
  
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

async function createAdminUser() {
  console.log('Creating admin user account...');
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'toan@zplus.vn' },
  });

  if (existingUser) {
    console.log('User already exists. Updating password and ensuring admin role.');
    
    // Update password
    const hashedPassword = await bcrypt.hash('ToanLinh', 10);
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });
    
    // Find admin role
    const adminRole = await prisma.role.findUnique({
      where: { name: 'ADMIN' },
    });
    
    if (!adminRole) {
      console.error('ADMIN role not found. Please run setup-roles-permissions.ts first.');
      return;
    }
    
    // Check if user has admin role
    const hasAdminRole = await prisma.userRole.findFirst({
      where: {
        userId: existingUser.id,
        roleId: adminRole.id,
      },
    });
    
    if (!hasAdminRole) {
      // Assign admin role
      await prisma.userRole.create({
        data: {
          userId: existingUser.id,
          roleId: adminRole.id,
        },
      });
      console.log('ADMIN role assigned to existing user.');
    } else {
      console.log('User already has ADMIN role.');
    }
    
    console.log('User updated successfully.');
    return existingUser;
  }

  // Create new user
  const hashedPassword = await bcrypt.hash('ToanLinh', 10);
  const newUser = await prisma.user.create({
    data: {
      email: 'toan@zplus.vn',
      password: hashedPassword,
      name: 'Toan Administrator',
    },
  });
  
  console.log('Admin user created successfully.');
  
  // Find admin role
  const adminRole = await prisma.role.findUnique({
    where: { name: 'ADMIN' },
  });
  
  if (!adminRole) {
    console.error('ADMIN role not found. Please run setup-roles-permissions.ts first.');
    return;
  }
  
  // Assign admin role to user
  await prisma.userRole.create({
    data: {
      userId: newUser.id,
      roleId: adminRole.id,
    },
  });
  
  console.log('ADMIN role assigned to new user.');
  console.log('Admin user setup completed successfully!');
  
  return newUser;
}

async function createSampleData() {
  console.log('Creating sample data...');
  
  // Create sample warehouse
  const warehouse = await prisma.warehouse.findFirst();
  if (!warehouse) {
    const newWarehouse = await prisma.warehouse.create({
      data: {
        name: 'Kho chính',
        address: '123 Đường ABC, Quận 1, TP.HCM',
      },
    });
    console.log('Created sample warehouse:', newWarehouse.name);
      // Create some warehouse locations
    await prisma.warehouseLocation.createMany({
      data: [
        {
          warehouseId: newWarehouse.id,
          zone: 'A',
          aisle: '1',
          rack: '1',
          shelf: '1',
          position: '1',
          description: 'Zone A, Rack 1-1, Shelf 1, Position 1',
        },
        {
          warehouseId: newWarehouse.id,
          zone: 'A',
          aisle: '1',
          rack: '1',
          shelf: '2',
          position: '1',
          description: 'Zone A, Rack 1-1, Shelf 2, Position 1',
        },
        {
          warehouseId: newWarehouse.id,
          zone: 'B',
          aisle: '1',
          rack: '1',
          shelf: '1',
          position: '1',
          description: 'Zone B, Rack 1-1, Shelf 1, Position 1',
        },
      ],
    });
    console.log('Created sample warehouse locations');
  }
  
  // Create sample product categories
  const category = await prisma.productCategory.findFirst();
  if (!category) {
    const electronicsCategory = await prisma.productCategory.create({
      data: {
        name: 'Điện tử',
        description: 'Các sản phẩm điện tử',
      },
    });
    
    const phoneCategory = await prisma.productCategory.create({
      data: {
        name: 'Điện thoại',
        description: 'Điện thoại di động',
        parentId: electronicsCategory.id,
      },
    });
    
    const laptopCategory = await prisma.productCategory.create({
      data: {
        name: 'Laptop',
        description: 'Máy tính xách tay',
        parentId: electronicsCategory.id,
      },
    });
    
    console.log('Created sample product categories');
  }
  
  // Create sample customer group
  const customerGroup = await prisma.customerGroup.findFirst();
  if (!customerGroup) {
    const vipGroup = await prisma.customerGroup.create({
      data: {
        name: 'VIP',
        description: 'Khách hàng VIP',
        discountRate: 10.0,
        creditLimit: 50000000,
        paymentTerms: 30,
        priority: 1,
      },
    });
    
    const regularGroup = await prisma.customerGroup.create({
      data: {
        name: 'Thường',
        description: 'Khách hàng thường',
        discountRate: 0.0,
        creditLimit: 10000000,
        paymentTerms: 15,
        priority: 0,
      },
    });
    
    console.log('Created sample customer groups');
  }
  
  console.log('Sample data creation completed!');
}

async function main() {
  try {
    console.log('🌱 Starting database seeding...');
    
    console.log('1. Setting up roles and permissions...');
    await createRoleWithPermissions(
      'ADMIN',
      'Full system administrator with complete access to all features',
      adminPermissions
    );

    await createRoleWithPermissions(
      'POS',
      'Point of sale operator with access to sales and customer management features',
      posPermissions
    );

    console.log('2. Creating admin user...');
    await createAdminUser();
    
    console.log('3. Creating sample data...');
    await createSampleData();

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Roles and permissions created');
    console.log('- Admin user created (email: toan@zplus.vn, password: ToanLinh)');
    console.log('- Sample warehouse and categories created');
    console.log('- Sample customer groups created');
    console.log('\n🚀 You can now start the application!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute seeding
main()
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  });
