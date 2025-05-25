import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { PermissionsService } from '../../permissions/permissions.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private permissions: PermissionsService,
  ) {    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.APP_JWT_SECRET || 'fallback-secret',
    });
  }

  async validate(payload: any) {
    // Find user by ID
    const user = await this.prisma.user.findUnique({ 
      where: { id: payload.sub } 
    });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if token is in Redis (valid session)
    const session = await this.redis.getSession(user.id);
    if (!session) {
      throw new UnauthorizedException('Session expired or invalid');
    }

    // Get user roles and permissions
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: user.id },
      include: { role: true },
    });
    
    const roleNames = userRoles.map(ur => ur.role.name);
    const permissions = await this.permissions.getUserPermissions(user.id);

    // Return user data without password
    const { password, ...userData } = user;
    return {
      ...userData,
      roles: roleNames,
      permissions,
    };
  }
}