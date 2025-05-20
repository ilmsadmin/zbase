// Simple script to test Redis caching services
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SessionCacheService } from './redis/session-cache.service';
import { CustomerCacheService } from './redis/customer-cache.service';
import { WarehouseCacheService } from './redis/warehouse-cache.service';
import { ReportCacheService } from './redis/report-cache.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get Redis cache services
  const sessionCache = app.get(SessionCacheService);
  const customerCache = app.get(CustomerCacheService);
  const warehouseCache = app.get(WarehouseCacheService);
  const reportCache = app.get(ReportCacheService);
  
  console.log('Testing SessionCacheService...');
  await sessionCache.cacheSession('test-session-1', 1, { role: 'admin', lastAccess: new Date() });
  const session = await sessionCache.getSession('test-session-1');
  console.log('Retrieved session:', session);
  
  console.log('\nTesting CustomerCacheService...');
  await customerCache.cacheCustomer(1, { id: 1, name: 'Test Customer', email: 'test@example.com' });
  const customer = await customerCache.getCustomer(1);
  console.log('Retrieved customer:', customer);
  
  console.log('\nTesting WarehouseCacheService...');
  await warehouseCache.cacheWarehouse(1, { id: 1, name: 'Main Warehouse', locationCount: 10 });
  const warehouse = await warehouseCache.getWarehouse(1);
  console.log('Retrieved warehouse:', warehouse);
  
  console.log('\nTesting ReportCacheService...');
  await reportCache.cacheReport('daily-sales-20250520', { date: '2025-05-20', total: 1000 });
  const report = await reportCache.getReport('daily-sales-20250520');
  console.log('Retrieved report:', report);
  
  await app.close();
  process.exit(0);
}

bootstrap().catch(err => {
  console.error('Error testing Redis cache services:', err);
  process.exit(1);
});
