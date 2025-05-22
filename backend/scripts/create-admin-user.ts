// Script to create admin user for zBase system
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
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
      return;
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
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
