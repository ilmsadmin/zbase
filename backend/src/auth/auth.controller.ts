import { Controller, Post, Body, Get, UseGuards, Req, Headers, Ip, UnauthorizedException, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.login({
      ...loginDto,
      ip,
      userAgent,
    });
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.authService.getProfile(req.user['id']);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.authService.logout(req.user['id']);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.authService.refreshToken(req.user['id']);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto
  ) {
    return this.authService.resetPassword(token, resetPasswordDto.password);
  }
}
