import { Module } from '@nestjs/common';
import { PosService } from './pos.service';
import { PosController } from './pos.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ShiftsModule } from '../shifts/shifts.module';
import { InventoryModule } from '../inventory/inventory.module';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [
    PrismaModule,
    ShiftsModule,
    InventoryModule,
    InvoicesModule,
    JwtModule.register({
      secret: process.env.APP_JWT_SECRET || 'super-secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [PosService],
  controllers: [PosController],
  exports: [PosService],
})
export class PosModule {}
