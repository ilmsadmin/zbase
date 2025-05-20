import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class CustomerCacheService {
  // Key prefixes
  private readonly CUSTOMER_KEY_PREFIX = 'customer:';
  private readonly CUSTOMER_GROUP_KEY_PREFIX = 'customer-group:';
  private readonly CUSTOMERS_BY_GROUP_KEY_PREFIX = 'customers:group:';
  
  // TTL values in seconds
  private readonly CUSTOMER_TTL = 3600; // 1 hour
  private readonly CUSTOMER_GROUP_TTL = 7200; // 2 hours
  private readonly CUSTOMERS_LIST_TTL = 1800; // 30 minutes

  constructor(private readonly redisService: RedisService) {}

  // Customer caching
  async cacheCustomer(customerId: number, customerData: object, ttl?: number): Promise<void> {
    const key = `${this.CUSTOMER_KEY_PREFIX}${customerId}`;
    await this.redisService.set(key, JSON.stringify(customerData), ttl || this.CUSTOMER_TTL);
  }

  async getCustomer(customerId: number): Promise<any | null> {
    const key = `${this.CUSTOMER_KEY_PREFIX}${customerId}`;
    const data = await this.redisService.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }

  async invalidateCustomer(customerId: number): Promise<void> {
    const key = `${this.CUSTOMER_KEY_PREFIX}${customerId}`;
    await this.redisService.del(key);
  }

  // Customer Group caching
  async cacheCustomerGroup(groupId: number, groupData: object, ttl?: number): Promise<void> {
    const key = `${this.CUSTOMER_GROUP_KEY_PREFIX}${groupId}`;
    await this.redisService.set(key, JSON.stringify(groupData), ttl || this.CUSTOMER_GROUP_TTL);
  }

  async getCustomerGroup(groupId: number): Promise<any | null> {
    const key = `${this.CUSTOMER_GROUP_KEY_PREFIX}${groupId}`;
    const data = await this.redisService.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }

  async invalidateCustomerGroup(groupId: number): Promise<void> {
    const key = `${this.CUSTOMER_GROUP_KEY_PREFIX}${groupId}`;
    await this.redisService.del(key);
    
    // Also invalidate the customers list for this group
    const listKey = `${this.CUSTOMERS_BY_GROUP_KEY_PREFIX}${groupId}`;
    await this.redisService.del(listKey);
  }

  // Customers by group caching
  async cacheCustomersByGroup(groupId: number, customers: object[], ttl?: number): Promise<void> {
    const key = `${this.CUSTOMERS_BY_GROUP_KEY_PREFIX}${groupId}`;
    await this.redisService.set(key, JSON.stringify(customers), ttl || this.CUSTOMERS_LIST_TTL);
  }

  async getCustomersByGroup(groupId: number): Promise<any[] | null> {
    const key = `${this.CUSTOMERS_BY_GROUP_KEY_PREFIX}${groupId}`;
    const data = await this.redisService.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }

  async invalidateCustomersByGroup(groupId: number): Promise<void> {
    const key = `${this.CUSTOMERS_BY_GROUP_KEY_PREFIX}${groupId}`;
    await this.redisService.del(key);
  }

  // Invalidate all customer related caches
  async invalidateAllCustomerCaches(): Promise<void> {
    const customerPattern = `${this.CUSTOMER_KEY_PREFIX}*`;
    const groupPattern = `${this.CUSTOMER_GROUP_KEY_PREFIX}*`;
    const listPattern = `${this.CUSTOMERS_BY_GROUP_KEY_PREFIX}*`;
    
    const customerKeys = await this.redisService.keys(customerPattern);
    const groupKeys = await this.redisService.keys(groupPattern);
    const listKeys = await this.redisService.keys(listPattern);
    
    const allKeys = [...customerKeys, ...groupKeys, ...listKeys];
    
    for (const key of allKeys) {
      await this.redisService.del(key);
    }
  }
}
