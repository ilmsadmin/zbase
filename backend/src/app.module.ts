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
// InventoryModule sẽ được uncomment khi module này được tạo
// import { InventoryModule } from './inventory/inventory.module';
import { HealthController, HealthService } from './health';
import { WarehousesModule } from './warehouses/warehouses.module';
import { WarehouseLocationsModule } from './warehouse-locations/warehouse-locations.module';
import { ProductsModule } from './products/products.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProductAttributesModule } from './product-attributes/product-attributes.module';

@Module({
  imports: [
    ConfigModule, 
    PrismaModule,
    RedisModule,
    MongoModule,
    UsersModule, 
    RolesModule,
    PermissionsModule,
    AuthModule, 
    PostsModule, 
    CommentsModule, WarehousesModule, WarehouseLocationsModule, ProductsModule, ProductCategoriesModule, ProductAttributesModule,
    // InventoryModule sẽ được uncomment khi module này được tạo
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, HealthService],
})
export class AppModule {}
