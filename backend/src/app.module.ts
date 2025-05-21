import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { MongoModule } from './mongo/mongo.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { HealthController, HealthService } from './health';
import { WarehousesModule } from './warehouses/warehouses.module';
import { WarehouseLocationsModule } from './warehouse-locations/warehouse-locations.module';
import { ProductsModule } from './products/products.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProductAttributesModule } from './product-attributes/product-attributes.module';
import { InventoryModule } from './inventory/inventory.module';
import { CustomersModule } from './customers/customers.module';
import { CustomerGroupsModule } from './customer-groups/customer-groups.module';
import { PartnersModule } from './partners/partners.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ShiftsModule } from './shifts/shifts.module';
import { PosModule } from './pos/pos.module';
import { PriceListsModule } from './price-lists/price-lists.module';
import { TransactionsModule } from './transactions/transactions.module';
import { WarrantiesModule } from './warranties/warranties.module';
import { ReportsModule } from './reports/reports.module';
import { ReportTemplatesModule } from './report-templates/report-templates.module';

@Module({  imports: [
    ConfigModule, 
    PrismaModule,
    RedisModule,
    MongoModule,
    UsersModule, 
    RolesModule,
    PermissionsModule,
    AuthModule, 
    PostsModule, 
    CommentsModule,
    WarehousesModule,
    WarehouseLocationsModule,
    ProductsModule,
    ProductCategoriesModule,
    ProductAttributesModule,
    InventoryModule,
    CustomersModule,
    CustomerGroupsModule,
    PartnersModule,
    InvoicesModule,
    ShiftsModule,
    PosModule,
    PriceListsModule,
    TransactionsModule,
    WarrantiesModule,
    ReportsModule,
    ReportTemplatesModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, HealthService],
})
export class AppModule {}
