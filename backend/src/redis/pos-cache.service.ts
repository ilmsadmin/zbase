import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class PosCacheService {
  // Key prefixes for different cache types
  private readonly PRODUCT_KEY_PREFIX = 'product:';
  private readonly PRODUCTS_BY_WAREHOUSE_KEY_PREFIX = 'products:warehouse:';
  private readonly CATEGORY_KEY_PREFIX = 'category:';
  private readonly CATEGORIES_KEY = 'categories';
  private readonly JWT_KEY_PREFIX = 'jwt:';
  private readonly INVENTORY_KEY_PREFIX = 'inventory:';
  
  // Default TTL values in seconds
  private readonly PRODUCT_TTL = 3600; // 1 hour
  private readonly CATEGORY_TTL = 7200; // 2 hours
  private readonly INVENTORY_TTL = 1800; // 30 minutes
  private readonly JWT_TTL = 86400; // 24 hours

  constructor(private readonly redisService: RedisService) {}

  // JWT Token Management
  async storeJwtToken(userId: number, token: string, expiresIn: number): Promise<void> {
    const key = `${this.JWT_KEY_PREFIX}${userId}`;
    await this.redisService.set(key, token, expiresIn);
  }

  async getJwtToken(userId: number): Promise<string | null> {
    const key = `${this.JWT_KEY_PREFIX}${userId}`;
    return this.redisService.get(key);
  }

  async invalidateJwtToken(userId: number): Promise<void> {
    const key = `${this.JWT_KEY_PREFIX}${userId}`;
    await this.redisService.del(key);
  }

  // Product Caching
  async cacheProduct(productId: number, productData: object, ttl?: number): Promise<void> {
    const key = `${this.PRODUCT_KEY_PREFIX}${productId}`;
    await this.redisService.set(key, JSON.stringify(productData), ttl || this.PRODUCT_TTL);
  }

  async getProductFromCache(productId: number): Promise<object | null> {
    const key = `${this.PRODUCT_KEY_PREFIX}${productId}`;
    const data = await this.redisService.get(key);
    return data ? JSON.parse(data) : null;
  }

  async invalidateProductCache(productId: number): Promise<void> {
    const key = `${this.PRODUCT_KEY_PREFIX}${productId}`;
    await this.redisService.del(key);
    
    // Also invalidate all warehouse product lists since they contain this product
    await this.invalidateAllWarehouseProducts();
  }

  // Products by Warehouse Caching
  async cacheWarehouseProducts(warehouseId: number, products: object[], ttl?: number): Promise<void> {
    const key = `${this.PRODUCTS_BY_WAREHOUSE_KEY_PREFIX}${warehouseId}`;
    await this.redisService.set(key, JSON.stringify(products), ttl || this.PRODUCT_TTL);
  }

  async getWarehouseProductsFromCache(warehouseId: number): Promise<object[] | null> {
    const key = `${this.PRODUCTS_BY_WAREHOUSE_KEY_PREFIX}${warehouseId}`;
    const data = await this.redisService.get(key);
    return data ? JSON.parse(data) : null;
  }

  async invalidateWarehouseProducts(warehouseId: number): Promise<void> {
    const key = `${this.PRODUCTS_BY_WAREHOUSE_KEY_PREFIX}${warehouseId}`;
    await this.redisService.del(key);
  }

  async invalidateAllWarehouseProducts(): Promise<void> {
    // This is a simplification - in a real implementation, you'd use scan to find all keys
    // with the prefix and delete them. For now, this is a placeholder.
    const keys = await this.redisService.keys(`${this.PRODUCTS_BY_WAREHOUSE_KEY_PREFIX}*`);
    for (const key of keys) {
      await this.redisService.del(key);
    }
  }

  // Category Caching
  async cacheCategory(categoryId: number, categoryData: object, ttl?: number): Promise<void> {
    const key = `${this.CATEGORY_KEY_PREFIX}${categoryId}`;
    await this.redisService.set(key, JSON.stringify(categoryData), ttl || this.CATEGORY_TTL);
    
    // Invalidate the categories list since it contains this category
    await this.invalidateCategoriesList();
  }

  async getCategoryFromCache(categoryId: number): Promise<object | null> {
    const key = `${this.CATEGORY_KEY_PREFIX}${categoryId}`;
    const data = await this.redisService.get(key);
    return data ? JSON.parse(data) : null;
  }

  async invalidateCategoryCache(categoryId: number): Promise<void> {
    const key = `${this.CATEGORY_KEY_PREFIX}${categoryId}`;
    await this.redisService.del(key);
    
    // Also invalidate the categories list
    await this.invalidateCategoriesList();
  }
  
  // Categories List Caching
  async cacheCategoriesList(categories: object[], ttl?: number): Promise<void> {
    await this.redisService.set(this.CATEGORIES_KEY, JSON.stringify(categories), ttl || this.CATEGORY_TTL);
  }

  async getCategoriesListFromCache(): Promise<object[] | null> {
    const data = await this.redisService.get(this.CATEGORIES_KEY);
    return data ? JSON.parse(data) : null;
  }

  async invalidateCategoriesList(): Promise<void> {
    await this.redisService.del(this.CATEGORIES_KEY);
  }

  // Inventory Caching
  async cacheInventory(warehouseId: number, productId: number, inventoryData: object, ttl?: number): Promise<void> {
    const key = `${this.INVENTORY_KEY_PREFIX}${warehouseId}:${productId}`;
    await this.redisService.set(key, JSON.stringify(inventoryData), ttl || this.INVENTORY_TTL);
  }

  async getInventoryFromCache(warehouseId: number, productId: number): Promise<object | null> {
    const key = `${this.INVENTORY_KEY_PREFIX}${warehouseId}:${productId}`;
    const data = await this.redisService.get(key);
    return data ? JSON.parse(data) : null;
  }

  async invalidateInventoryCache(warehouseId: number, productId: number): Promise<void> {
    const key = `${this.INVENTORY_KEY_PREFIX}${warehouseId}:${productId}`;
    await this.redisService.del(key);
  }

  async invalidateWarehouseInventory(warehouseId: number): Promise<void> {
    // This is a simplification - in a real implementation, you'd use scan to find all keys
    // with the prefix and delete them
    const keys = await this.redisService.keys(`${this.INVENTORY_KEY_PREFIX}${warehouseId}:*`);
    for (const key of keys) {
      await this.redisService.del(key);
    }
  }

  // Cache invalidation pattern for product update events
  async handleProductUpdated(productId: number): Promise<void> {
    // Invalidate the specific product cache
    await this.invalidateProductCache(productId);
    
    // Invalidate all warehouse products lists
    await this.invalidateAllWarehouseProducts();
    
    // If the product's category changed, we would need to invalidate category caches as well
    // This is a simplification
    await this.invalidateCategoriesList();
  }

  // Cache invalidation pattern for inventory update events
  async handleInventoryUpdated(warehouseId: number, productId: number): Promise<void> {
    // Invalidate the specific inventory cache
    await this.invalidateInventoryCache(warehouseId, productId);
    
    // Invalidate the warehouse products list
    await this.invalidateWarehouseProducts(warehouseId);
    
    // Invalidate the product cache since available quantity is often included
    await this.invalidateProductCache(productId);
  }
}
