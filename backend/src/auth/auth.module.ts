import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
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
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwtSecret'),
        signOptions: {
          expiresIn: configService.get<string>('app.jwtExpiresIn', '1d'),
        },
      }),
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
