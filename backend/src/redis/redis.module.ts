import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { PosCacheService } from './pos-cache.service';
import { SessionCacheService } from './session-cache.service';
import { CustomerCacheService } from './customer-cache.service';
import { WarehouseCacheService } from './warehouse-cache.service';
import { ReportCacheService } from './report-cache.service';

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
      useValue: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
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
