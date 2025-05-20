import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { PosCacheService } from './pos-cache.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    RedisService,
    PosCacheService,
    {
      provide: 'REDIS_OPTIONS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('app.redisHost', 'localhost'),
        port: configService.get<number>('app.redisPort', 6379),
      }),
    },
  ],
  exports: [RedisService, PosCacheService],
})
export class RedisModule {}
