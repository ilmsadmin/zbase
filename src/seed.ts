import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Seeder');
  const app = await NestFactory.create(AppModule);
  const userService = app.get(UserService);

  try {
    // Tạo tài khoản Super Admin
    const adminExists = await userService.findByEmail('admin@example.com');
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await userService.create({
        name: 'Super Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        roles: ['admin', 'user'],
      });      logger.log('Super Admin account created');
    } else {
      logger.log('Super Admin already exists');
    }

    // Tạo tài khoản Manager
    const managerExists = await userService.findByEmail('manager@example.com');
    if (!managerExists) {
      const hashedPassword = await bcrypt.hash('manager123', 10);
      await userService.create({
        name: 'Manager Admin',
        email: 'manager@example.com',
        password: hashedPassword,
        roles: ['admin', 'manager', 'user'],
      });      logger.log('Manager Admin account created');
    } else {
      logger.log('Manager Admin already exists');
    }

    // Tạo tài khoản User thường
    const userExists = await userService.findByEmail('user@example.com');
    if (!userExists) {
      const hashedPassword = await bcrypt.hash('user123', 10);
      await userService.create({
        name: 'Regular User',
        email: 'user@example.com',
        password: hashedPassword,
        roles: ['user'],
      });      logger.log('Regular User account created');
    } else {
      logger.log('Regular User already exists');
    }

    // Tạo tài khoản Editor
    const editorExists = await userService.findByEmail('editor@example.com');
    if (!editorExists) {
      const hashedPassword = await bcrypt.hash('editor123', 10);
      await userService.create({
        name: 'Content Editor',
        email: 'editor@example.com',
        password: hashedPassword,
        roles: ['editor', 'user'],
      });
      logger.log('Editor account created');
    } else {
      logger.log('Editor account already exists');
    }
    
    // Tạo tài khoản SEO Specialist
    const seoExists = await userService.findByEmail('seo@example.com');
    if (!seoExists) {
      const hashedPassword = await bcrypt.hash('seo123', 10);
      await userService.create({
        name: 'SEO Specialist',
        email: 'seo@example.com',
        password: hashedPassword,
        roles: ['seo', 'user'],
      });
      logger.log('SEO Specialist account created');
    } else {
      logger.log('SEO Specialist already exists');
    }

    logger.log('Sample users initialization completed');
  } catch (error) {
    logger.error(`Error creating sample users: ${error.message}`);
    if (error.stack) {
      logger.error(error.stack);
    }
  } finally {
    await app.close();
  }
}

bootstrap();