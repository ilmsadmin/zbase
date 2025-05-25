import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { InvoiceTemplatesService } from './invoice-templates.service';
import { InvoiceTemplatesController } from './invoice-templates.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { InventoryModule } from '../inventory/inventory.module';
import { MailModule } from '../mail/mail.module';

@Module({  
  imports: [
    PrismaModule,
    InventoryModule,
    MailModule,
    JwtModule.register({
      secret: process.env.APP_JWT_SECRET || 'super-secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [InvoicesService, InvoiceTemplatesService],
  controllers: [InvoicesController, InvoiceTemplatesController],
  exports: [InvoicesService, InvoiceTemplatesService],
})
export class InvoicesModule {}
