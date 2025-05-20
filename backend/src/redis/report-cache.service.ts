import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class ReportCacheService {
  // Key prefixes
  private readonly REPORT_KEY_PREFIX = 'report:';
  private readonly REPORT_TEMPLATE_KEY_PREFIX = 'report-template:';
  private readonly REPORTS_BY_TYPE_KEY_PREFIX = 'reports:type:';
  private readonly REPORT_DATA_KEY_PREFIX = 'report-data:';
  
  // TTL values in seconds
  private readonly REPORT_TTL = 3600; // 1 hour
  private readonly REPORT_TEMPLATE_TTL = 86400; // 24 hours
  private readonly REPORT_LIST_TTL = 1800; // 30 minutes
  private readonly REPORT_DATA_TTL = 7200; // 2 hours

  constructor(private readonly redisService: RedisService) {}

  // Report caching
  async cacheReport(reportId: string | number, reportData: object, ttl?: number): Promise<void> {
    const key = `${this.REPORT_KEY_PREFIX}${reportId}`;
    await this.redisService.set(key, JSON.stringify(reportData), ttl || this.REPORT_TTL);
  }

  async getReport(reportId: string | number): Promise<any | null> {
    const key = `${this.REPORT_KEY_PREFIX}${reportId}`;
    const data = await this.redisService.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }

  async invalidateReport(reportId: string | number): Promise<void> {
    const key = `${this.REPORT_KEY_PREFIX}${reportId}`;
    await this.redisService.del(key);
  }

  // Report template caching
  async cacheReportTemplate(templateId: string | number, templateData: object, ttl?: number): Promise<void> {
    const key = `${this.REPORT_TEMPLATE_KEY_PREFIX}${templateId}`;
    await this.redisService.set(key, JSON.stringify(templateData), ttl || this.REPORT_TEMPLATE_TTL);
  }

  async getReportTemplate(templateId: string | number): Promise<any | null> {
    const key = `${this.REPORT_TEMPLATE_KEY_PREFIX}${templateId}`;
    const data = await this.redisService.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }

  async invalidateReportTemplate(templateId: string | number): Promise<void> {
    const key = `${this.REPORT_TEMPLATE_KEY_PREFIX}${templateId}`;
    await this.redisService.del(key);
  }

  // Reports by type caching
  async cacheReportsByType(type: string, reports: object[], ttl?: number): Promise<void> {
    const key = `${this.REPORTS_BY_TYPE_KEY_PREFIX}${type}`;
    await this.redisService.set(key, JSON.stringify(reports), ttl || this.REPORT_LIST_TTL);
  }

  async getReportsByType(type: string): Promise<any[] | null> {
    const key = `${this.REPORTS_BY_TYPE_KEY_PREFIX}${type}`;
    const data = await this.redisService.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }

  async invalidateReportsByType(type: string): Promise<void> {
    const key = `${this.REPORTS_BY_TYPE_KEY_PREFIX}${type}`;
    await this.redisService.del(key);
  }

  // Report data caching (for expensive report computations)
  async cacheReportData(reportId: string | number, key: string, reportData: any, ttl?: number): Promise<void> {
    const cacheKey = `${this.REPORT_DATA_KEY_PREFIX}${reportId}:${key}`;
    await this.redisService.set(cacheKey, JSON.stringify(reportData), ttl || this.REPORT_DATA_TTL);
  }

  async getReportData(reportId: string | number, key: string): Promise<any | null> {
    const cacheKey = `${this.REPORT_DATA_KEY_PREFIX}${reportId}:${key}`;
    const data = await this.redisService.get(cacheKey);
    if (!data) return null;
    return JSON.parse(data);
  }

  async invalidateReportData(reportId: string | number, key?: string): Promise<void> {
    if (key) {
      const cacheKey = `${this.REPORT_DATA_KEY_PREFIX}${reportId}:${key}`;
      await this.redisService.del(cacheKey);
    } else {
      // Invalidate all keys for this report
      const pattern = `${this.REPORT_DATA_KEY_PREFIX}${reportId}:*`;
      const keys = await this.redisService.keys(pattern);
      for (const key of keys) {
        await this.redisService.del(key);
      }
    }
  }

  // Invalidate all report related caches
  async invalidateAllReportCaches(): Promise<void> {
    const reportPattern = `${this.REPORT_KEY_PREFIX}*`;
    const templatePattern = `${this.REPORT_TEMPLATE_KEY_PREFIX}*`;
    const typePattern = `${this.REPORTS_BY_TYPE_KEY_PREFIX}*`;
    const dataPattern = `${this.REPORT_DATA_KEY_PREFIX}*`;
    
    const reportKeys = await this.redisService.keys(reportPattern);
    const templateKeys = await this.redisService.keys(templatePattern);
    const typeKeys = await this.redisService.keys(typePattern);
    const dataKeys = await this.redisService.keys(dataPattern);
    
    const allKeys = [...reportKeys, ...templateKeys, ...typeKeys, ...dataKeys];
    
    for (const key of allKeys) {
      await this.redisService.del(key);
    }
  }
}
