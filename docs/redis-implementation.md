# Redis Implementation for POS System

This document describes the Redis implementation for the POS System in the ZBase application.

## Architecture

The Redis implementation involves several components:

1. **RedisService**: The base service for Redis operations.
2. **PosCacheService**: A specialized service for POS system caching requirements.
3. **JwtRedisStrategy**: A Passport.js strategy for JWT authentication with Redis storage.
4. **JwtRedisAuthGuard**: A guard that uses the JwtRedisStrategy for route protection.

## Key Features

### 1. JWT Token Management

- Tokens are stored in Redis with a TTL matching the JWT expiration
- Key format: `jwt:{userId}`
- Every authentication validates tokens against Redis storage
- Token invalidation on logout for immediate effect

### 2. Product Caching

- Individual product caching with key format: `product:{productId}`
- Warehouse product lists with key format: `products:warehouse:{warehouseId}`
- Default TTL of 1 hour for product data
- Invalidation patterns for CRUD operations

### 3. Category Caching

- Individual category caching with key format: `category:{categoryId}`
- Complete category list cached at key: `categories`
- Default TTL of 2 hours for category data
- Cascade invalidation when categories are updated

### 4. Inventory Caching

- Inventory records cached with key format: `inventory:{warehouseId}:{productId}`
- Default TTL of 30 minutes for inventory data
- Invalidation when inventory movements occur

## Cache Invalidation Strategies

1. **Direct Invalidation**: When a specific entity is updated, its cache is directly invalidated
2. **Cascade Invalidation**: When an entity is updated that affects other entities (e.g., product update affecting inventory), related caches are also invalidated
3. **TTL-based Expiration**: All cache entries have a TTL to ensure stale data is eventually removed

## Usage Examples

### JWT Authentication

```typescript
// In controllers
@UseGuards(JwtRedisAuthGuard)
@Get('protected-route')
getProtectedResource() {
  // This route is protected and uses Redis for token validation
}
```

### Product Caching

```typescript
// In a service
async getProduct(productId: number) {
  // Try to get from cache first
  const cachedProduct = await this.posCacheService.getProductFromCache(productId);
  if (cachedProduct) {
    return cachedProduct;
  }
  
  // If not in cache, get from database
  const product = await this.prismaService.product.findUnique({
    where: { id: productId }
  });
  
  // Cache for future requests
  if (product) {
    await this.posCacheService.cacheProduct(productId, product);
  }
  
  return product;
}
```

## Monitoring and Maintenance

- Redis memory usage should be monitored in production
- Cache hit/miss rates should be tracked to optimize TTL values
- Consider implementing a global cache flush mechanism for maintenance or emergency situations
