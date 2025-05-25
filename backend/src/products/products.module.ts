import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductAttributesModule } from '../product-attributes/product-attributes.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule, 
    ProductAttributesModule,
    JwtModule.register({
      secret: process.env.APP_JWT_SECRET || 'super-secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService]
})
export class ProductsModule {}
