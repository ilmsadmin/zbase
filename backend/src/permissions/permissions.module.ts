import { Module, forwardRef } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { PermissionsController } from './permissions.controller';
import { ActionsDiscoveryService } from './actions-discovery.service';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, RedisModule, DiscoveryModule, forwardRef(() => AuthModule)],
  controllers: [PermissionsController],
  providers: [
    PermissionsService, 
    ActionsDiscoveryService,
    MetadataScanner
  ],
  exports: [PermissionsService, ActionsDiscoveryService],
})
export class PermissionsModule {}
