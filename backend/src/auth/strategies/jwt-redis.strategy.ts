import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PosCacheService } from '../../redis/pos-cache.service';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtRedisStrategy extends PassportStrategy(Strategy, 'jwt-redis') {
  constructor(
    private readonly posCacheService: PosCacheService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.APP_JWT_SECRET || 'super-secret',
      passReqToCallback: true,
    } as any); // Using 'as any' to bypass TypeScript's strict checking
  }

  async validate(request: Request, payload: any) {
    // Extract token from Authorization header
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    
    // Verify if token exists in Redis for this user
    const cachedToken = await this.posCacheService.getJwtToken(payload.sub);
    
    if (!cachedToken || cachedToken !== token) {
      throw new UnauthorizedException('Invalid token or session expired');
    }

    // Get user details
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return user with roles and permissions for Guards
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: payload.roles || [],
      permissions: payload.permissions || [],
    };
  }
}
