import { Injectable, Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(private configService: ConfigService) {}

  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: this.configService.get('app.nodeEnv'),
      version: process.env.npm_package_version || 'development',
    };
  }
}

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  check() {
    return this.healthService.check();
  }
}
