import { Module } from '@nestjs/common';
import { WarehouseLocationsService } from './warehouse-locations.service';
import { WarehouseLocationsController } from './warehouse-locations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.APP_JWT_SECRET || 'super-secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [WarehouseLocationsService],
  controllers: [WarehouseLocationsController],
  exports: [WarehouseLocationsService]
})
export class WarehouseLocationsModule {}
