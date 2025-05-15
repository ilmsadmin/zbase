import { Controller, Get, Render, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Controller('admin')
export class ProductsViewController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  private getUserFromRequest(request: any) {
    try {
      const token = request?.cookies?.jwt;
      if (!token) {
        return null;
      }
      const secret = this.configService.get<string>('JWT_SECRET') || 'fallback_secret';
      const payload = this.jwtService.verify(token, { secret });
      return { 
        userId: payload.sub, 
        email: payload.email,
        roles: payload.roles,
        isAuthenticated: true,
        isAdmin: payload.roles.includes('admin')
      };
    } catch (e) {
      return null;
    }
  }

  @Get('products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @Render('pages/admin-products')
  adminProducts(@Request() req) {
    const user = this.getUserFromRequest(req);
    return {
      title: 'Product Management - ZBase',
      user,
      path: '/admin/products'
    };
  }
}
