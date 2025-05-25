import { Module } from '@nestjs/common';
import { CustomerGroupsService } from './customer-groups.service';
import { CustomerGroupsController } from './customer-groups.controller';
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
  providers: [CustomerGroupsService],
  controllers: [CustomerGroupsController],
  exports: [CustomerGroupsService],
})
export class CustomerGroupsModule {}
