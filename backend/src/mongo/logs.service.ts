import { Injectable, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogActionType, LogResourceType } from './schemas/log.schema';

export interface CreateLogDto {
  userId: number;
  action: string;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userMetadata?: {
    name?: string;
    email?: string;
    roles?: string[];
  };
}

export interface LogQueryOptions {
  userId?: number;
  action?: string | string[];
  resourceType?: string | string[];
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
  details?: Record<string, any>; // Added details field for inventory queries
}

@Injectable()
export class LogsService {
  private readonly isMongoEnabled: boolean;

  constructor(
    @Optional() @InjectModel(Log.name) private readonly logModel?: Model<Log>,
  ) {
    this.isMongoEnabled = !!this.logModel;
  }

  async createLog(logData: CreateLogDto) {
    if (!this.isMongoEnabled) {
      console.log(`[Logs] User ${logData.userId} performed action: ${logData.action}`, 
        {
          resourceType: logData.resourceType,
          resourceId: logData.resourceId,
          details: logData.details || {}
        });
      return null;
    }
    return this.logModel!.create({
      userId: logData.userId,
      action: logData.action,
      resourceType: logData.resourceType,
      resourceId: logData.resourceId,
      details: logData.details || {},
      ipAddress: logData.ipAddress,
      userMetadata: logData.userMetadata,
    });
  }
  
  async findLogs(options: LogQueryOptions = {}) {
    if (!this.isMongoEnabled) {
      console.log('[Logs] Trying to find logs with query:', options);
      return [];
    }

    const query: any = {};
    
    if (options.userId) {
      query.userId = options.userId;
    }
    
    if (options.action) {
      if (Array.isArray(options.action)) {
        query.action = { $in: options.action };
      } else {
        query.action = options.action;
      }
    }
    
    if (options.resourceType) {
      if (Array.isArray(options.resourceType)) {
        query.resourceType = { $in: options.resourceType };
      } else {
        query.resourceType = options.resourceType;
      }
    }
    
    if (options.resourceId) {
      query.resourceId = options.resourceId;
    }
    
    // Date range query
    if (options.startDate || options.endDate) {
      query.createdAt = {};
      
      if (options.startDate) {
        query.createdAt.$gte = options.startDate;
      }
      
      if (options.endDate) {
        query.createdAt.$lte = options.endDate;
      }
    }
    
    const sort = options.sort || { createdAt: -1 };
    const limit = options.limit || 100;
    const skip = options.skip || 0;
    
    return this.logModel!.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  }
  
  async findLogsByUserId(userId: number, options: Omit<LogQueryOptions, 'userId'> = {}) {
    return this.findLogs({ ...options, userId });
  }

  async findLogsByAction(action: string, options: Omit<LogQueryOptions, 'action'> = {}) {
    return this.findLogs({ ...options, action });
  }

  async findLogsByResource(resourceType: string, resourceId: string, options: Omit<LogQueryOptions, 'resourceType' | 'resourceId'> = {}) {
    return this.findLogs({ ...options, resourceType, resourceId });
  }

  async findLogsByDateRange(startDate: Date, endDate: Date, options: Omit<LogQueryOptions, 'startDate' | 'endDate'> = {}) {
    return this.findLogs({ ...options, startDate, endDate });
  }

  // Specialized methods for POS system
  
  async findInventoryLogs(warehouseId?: string, productId?: string, options: Omit<LogQueryOptions, 'resourceType' | 'action'> = {}) {
    const query: LogQueryOptions = {
      ...options,
      resourceType: LogResourceType.INVENTORY,
      action: [LogActionType.IMPORT_INVENTORY, LogActionType.EXPORT_INVENTORY]
    };
    
    if (warehouseId || productId) {
      query.details = {}; // This is simplified for this example
    }
    
    return this.findLogs(query);
  }
  
  async findSalesLogs(options: Omit<LogQueryOptions, 'action'> = {}) {
    return this.findLogs({ 
      ...options,
      action: LogActionType.CREATE_SALE
    });
  }
    async findWarrantyLogs(options: Omit<LogQueryOptions, 'resourceType'> = {}) {
    return this.findLogs({
      ...options,
      resourceType: LogResourceType.WARRANTY
    });
  }
}
