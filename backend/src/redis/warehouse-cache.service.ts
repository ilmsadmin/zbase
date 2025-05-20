import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class WarehouseCacheService {
  // Key prefixes
  private readonly WAREHOUSE_KEY_PREFIX = 'warehouse:';
  private readonly WAREHOUSE_LOCATION_KEY_PREFIX = 'warehouse-location:';
  private readonly LOCATIONS_BY_WAREHOUSE_KEY_PREFIX = 'locations:warehouse:';
  
  // TTL values in seconds
  private readonly WAREHOUSE_TTL = 7200; // 2 hours
  private readonly WAREHOUSE_LOCATION_TTL = 3600; // 1 hour
  private readonly LOCATIONS_LIST_TTL = 1800; // 30 minutes

  constructor(private readonly redisService: RedisService) {}

  // Warehouse caching
  async cacheWarehouse(warehouseId: number, warehouseData: object, ttl?: number): Promise<void> {
    const key = `${this.WAREHOUSE_KEY_PREFIX}${warehouseId}`;
    await this.redisService.set(key, JSON.stringify(warehouseData), ttl || this.WAREHOUSE_TTL);
  }

  async getWarehouse(warehouseId: number): Promise<any | null> {
    const key = `${this.WAREHOUSE_KEY_PREFIX}${warehouseId}`;
    const data = await this.redisService.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }

  async invalidateWarehouse(warehouseId: number): Promise<void> {
    const key = `${this.WAREHOUSE_KEY_PREFIX}${warehouseId}`;
    await this.redisService.del(key);
    
    // Also invalidate the locations list for this warehouse
    const listKey = `${this.LOCATIONS_BY_WAREHOUSE_KEY_PREFIX}${warehouseId}`;
    await this.redisService.del(listKey);
  }

  // Warehouse Location caching
  async cacheWarehouseLocation(locationId: number, locationData: object, ttl?: number): Promise<void> {
    const key = `${this.WAREHOUSE_LOCATION_KEY_PREFIX}${locationId}`;
    await this.redisService.set(key, JSON.stringify(locationData), ttl || this.WAREHOUSE_LOCATION_TTL);
  }

  async getWarehouseLocation(locationId: number): Promise<any | null> {
    const key = `${this.WAREHOUSE_LOCATION_KEY_PREFIX}${locationId}`;
    const data = await this.redisService.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }

  async invalidateWarehouseLocation(locationId: number, warehouseId?: number): Promise<void> {
    const key = `${this.WAREHOUSE_LOCATION_KEY_PREFIX}${locationId}`;
    await this.redisService.del(key);
    
    // If warehouseId is provided, invalidate the locations list for this warehouse
    if (warehouseId) {
      const listKey = `${this.LOCATIONS_BY_WAREHOUSE_KEY_PREFIX}${warehouseId}`;
      await this.redisService.del(listKey);
    }
  }

  // Locations by warehouse caching
  async cacheLocationsByWarehouse(warehouseId: number, locations: object[], ttl?: number): Promise<void> {
    const key = `${this.LOCATIONS_BY_WAREHOUSE_KEY_PREFIX}${warehouseId}`;
    await this.redisService.set(key, JSON.stringify(locations), ttl || this.LOCATIONS_LIST_TTL);
  }

  async getLocationsByWarehouse(warehouseId: number): Promise<any[] | null> {
    const key = `${this.LOCATIONS_BY_WAREHOUSE_KEY_PREFIX}${warehouseId}`;
    const data = await this.redisService.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }

  async invalidateLocationsByWarehouse(warehouseId: number): Promise<void> {
    const key = `${this.LOCATIONS_BY_WAREHOUSE_KEY_PREFIX}${warehouseId}`;
    await this.redisService.del(key);
  }

  // Invalidate all warehouse related caches
  async invalidateAllWarehouseCaches(): Promise<void> {
    const warehousePattern = `${this.WAREHOUSE_KEY_PREFIX}*`;
    const locationPattern = `${this.WAREHOUSE_LOCATION_KEY_PREFIX}*`;
    const listPattern = `${this.LOCATIONS_BY_WAREHOUSE_KEY_PREFIX}*`;
    
    const warehouseKeys = await this.redisService.keys(warehousePattern);
    const locationKeys = await this.redisService.keys(locationPattern);
    const listKeys = await this.redisService.keys(listPattern);
    
    const allKeys = [...warehouseKeys, ...locationKeys, ...listKeys];
    
    for (const key of allKeys) {
      await this.redisService.del(key);
    }
  }
}
