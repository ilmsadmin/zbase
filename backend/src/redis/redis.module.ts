import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { PosCacheService } from './pos-cache.service';
import { SessionCacheService } from './session-cache.service';
import { CustomerCacheService } from './customer-cache.service';
import { WarehouseCacheService } from './warehouse-cache.service';
import { ReportCacheService } from './report-cache.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    RedisService,
    PosCacheService,
    SessionCacheService,
    CustomerCacheService,
    WarehouseCacheService,
    ReportCacheService,
    {
      provide: 'REDIS_OPTIONS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('app.redisHost', 'localhost'),
        port: configService.get<number>('app.redisPort', 6379),
      }),
    },
  ],
  exports: [
    RedisService, 
    PosCacheService, 
    SessionCacheService,
    CustomerCacheService,
    WarehouseCacheService,
    ReportCacheService,
  ],
})
export class RedisModule {}
