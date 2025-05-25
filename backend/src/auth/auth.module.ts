import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRedisStrategy } from './strategies/jwt-redis.strategy';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from '../redis/redis.module';
import { MongoModule } from '../mongo/mongo.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesModule } from '../roles/roles.module';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    RedisModule,
    MongoModule,
    forwardRef(() => PermissionsModule),
    RolesModule,
    JwtModule.register({
      secret: process.env.APP_JWT_SECRET || 'super-secret',
      signOptions: {
        expiresIn: process.env.APP_JWT_EXPIRES_IN || '86400',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy,
    JwtRedisStrategy,
    RolesGuard
  ],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
