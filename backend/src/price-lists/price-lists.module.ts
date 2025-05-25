import { Module } from '@nestjs/common';
import { PriceListsService } from './price-lists.service';
import { PriceListsController } from './price-lists.controller';
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
  providers: [PriceListsService],
  controllers: [PriceListsController],
  exports: [PriceListsService],
})
export class PriceListsModule {}
