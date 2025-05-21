import { Module } from '@nestjs/common';
import { WarehouseLocationsService } from './warehouse-locations.service';
import { WarehouseLocationsController } from './warehouse-locations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [WarehouseLocationsService],
  controllers: [WarehouseLocationsController],
  exports: [WarehouseLocationsService]
})
export class WarehouseLocationsModule {}
