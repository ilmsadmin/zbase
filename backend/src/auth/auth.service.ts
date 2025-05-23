import { Injectable, UnauthorizedException, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { RedisService } from '../redis/redis.service';
import { PosCacheService } from '../redis/pos-cache.service';
import { PermissionsService } from '../permissions/permissions.service';
import { LogsService, CreateLogDto } from '../mongo/logs.service';
import { LogActionType, LogResourceType } from '../mongo/schemas/log.schema';
import { Role } from '../common/enums/role.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
    private posCacheService: PosCacheService,
    @Inject(forwardRef(() => PermissionsService))
    private permissionsService: PermissionsService,
    private logsService: LogsService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }    // Get user roles
    const roleNames = await this.usersService.getUserRoles(user.id);
    
    // Create JWT payload
    const payload = { 
      email: user.email, 
      sub: user.id, 
      roles: roleNames 
    };
    
    // JWT configuration
    const jwtSecret = this.configService.get<string>('app.jwtSecret');
    const expiresIn = parseInt(this.configService.get<string>('app.jwtExpiresIn', '86400'), 10);
    
    // Generate token
    const token = this.jwtService.sign(payload, { 
      secret: jwtSecret,
      expiresIn
    });
    
    // Store session in Redis
    await this.redisService.setSession(user.id, token, expiresIn);
    
    // Also store in PosCacheService for improved authentication
    await this.posCacheService.storeJwtToken(user.id, token, expiresIn);
    
    // Log login action
    await this.logsService.createLog({
      userId: user.id,
      action: LogActionType.LOGIN,
      details: { 
        ip: loginDto.ip || 'unknown',
        userAgent: loginDto.userAgent || 'unknown'
      }
    });
    
    // Get user permissions
    const permissions = await this.permissionsService.getUserPermissions(user.id);
    
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: roleNames,
        permissions,
      },
    };
  }
  async logout(userId: string) {
    try {
      // Convert userId to number
      const userIdNum = parseInt(userId, 10);
      
      // Log the logout action
      const logDto: CreateLogDto = {
        action: LogActionType.LOGOUT,
        resourceType: LogResourceType.AUTH,
        userId: userIdNum,
        details: { message: 'User logged out' },
      };
      this.logsService.createLog(logDto);
      
      // Add any cache invalidation logic here if needed
      // Since these methods don't exist, we'll just log it for now
      console.log(`Logged out user ${userId}. Cache invalidation would happen here.`);
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Error during logout:', error);
      return { success: false, message: 'Error during logout' };
    }
  }
  async forgotPassword(email: string) {
    // Find the user by email
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      // For security reasons, don't reveal if the email exists
      return { success: true, message: 'If the email exists, a reset link will be sent' };
    }
    
    // Generate a unique reset token
    const resetToken = uuidv4();
    const expiresIn = 3600; // 1 hour in seconds
    
    // Store the token in Redis with expiration
    const tokenKey = `reset_token:${resetToken}`;
    await this.redisService.set(tokenKey, user.id.toString(), expiresIn);
    
    // In a real application, this would send an email with a reset link
    // For now, just log it and return the token for testing
    console.log(`Reset token for ${email}: ${resetToken}`);
    
    // Log the password reset request
    const logDto: CreateLogDto = {
      action: LogActionType.PASSWORD_RESET_REQUEST,
      resourceType: LogResourceType.AUTH,
      userId: user.id,
      details: { email },
    };
    this.logsService.createLog(logDto);
    
    return { 
      success: true, 
      message: 'If the email exists, a reset link will be sent',
      // In production, don't return the token in the response
      // This is just for testing purposes
      token: resetToken
    };
  }

  async resetPassword(token: string, newPassword: string) {
    // Check if the token exists in Redis
    const tokenKey = `reset_token:${token}`;
    const userIdStr = await this.redisService.get(tokenKey);
    
    if (!userIdStr) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    
    // Convert userId to number
    const userId = parseInt(userIdStr, 10);
    
    // Find the user
    const user = await this.usersService.findOne(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update the user's password
    await this.usersService.updatePassword(userId, hashedPassword);
    
    // Delete the token from Redis
    await this.redisService.del(tokenKey);
    
    // Log the password reset
    const logDto: CreateLogDto = {
      action: LogActionType.PASSWORD_RESET_COMPLETE,
      resourceType: LogResourceType.AUTH,
      userId: userId,
      details: { message: 'Password reset completed' },
    };
    this.logsService.createLog(logDto);
    
    return { success: true, message: 'Password reset successfully' };
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findOne(userId);    const userRoles = await this.usersService.getUserRoles(userId);
    const permissions = await this.permissionsService.getUserPermissions(userId);
    
    return {
      ...user,
      roles: userRoles,
      permissions,
    };
  }
  async refreshToken(userId: number) {
    const user = await this.usersService.findOne(userId);
    const roleNames = await this.usersService.getUserRoles(userId);
    
    // Create JWT payload
    const payload = { 
      email: user.email, 
      sub: user.id, 
      roles: roleNames 
    };
    
    // JWT configuration
    const jwtSecret = this.configService.get<string>('app.jwtSecret');
    const expiresIn = parseInt(this.configService.get<string>('app.jwtExpiresIn', '86400'), 10);
    
    // Generate token
    const token = this.jwtService.sign(payload, { 
      secret: jwtSecret,
      expiresIn
    });
    
    // Store session in Redis
    await this.redisService.setSession(user.id, token, expiresIn);
    // Also store in PosCacheService
    await this.posCacheService.storeJwtToken(user.id, token, expiresIn);
    
    // Log refresh action
    await this.logsService.createLog({
      userId,
      action: 'token_refresh'
    });
    
    return {
      access_token: token,
    };
  }

  decodeToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('app.jwtSecret'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}