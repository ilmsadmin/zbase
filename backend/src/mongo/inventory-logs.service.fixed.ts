import { Injectable, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InventoryLog, InventoryActionType } from './schemas/inventory-log.schema';

export interface CreateInventoryLogDto {
  productId: number;
  productName: string;
  productCode: string;
  warehouseId: number;
  warehouseName: string;
  locationId?: number;
  locationDescription?: string;
  actionType: string;
  quantity: number;
  previousQuantity?: number;
  newQuantity?: number;
  referenceId?: number;
  referenceType?: string;
  referenceCode?: string;
  userId?: number;
  userName?: string;
  notes?: string;
}

export interface InventoryLogQueryOptions {
  productId?: number;
  warehouseId?: number;
  locationId?: number;
  actionType?: string | string[];
  startDate?: Date;
  endDate?: Date;
  referenceId?: number;
  referenceType?: string;
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
}

@Injectable()
export class InventoryLogsService {
  private readonly isMongoEnabled: boolean;

  constructor(
    @Optional() @InjectModel(InventoryLog.name) private readonly inventoryLogModel: Model<InventoryLog> | null,
  ) {
    this.isMongoEnabled = !!this.inventoryLogModel;
    
    if (!this.isMongoEnabled) {
      console.warn('MongoDB is not properly configured. Inventory logs will be disabled.');
    }
  }

  async create(createLogDto: CreateInventoryLogDto): Promise<InventoryLog | null> {
    if (!this.isMongoEnabled || !this.inventoryLogModel) {
      console.warn('MongoDB is not enabled, inventory log not created');
      return null;
    }

    try {
      const createdLog = new this.inventoryLogModel(createLogDto);
      return createdLog.save();
    } catch (error) {
      console.error('Error creating inventory log:', error);
      return null;
    }
  }

  async findAll(options: InventoryLogQueryOptions = {}): Promise<InventoryLog[]> {
    if (!this.isMongoEnabled || !this.inventoryLogModel) {
      return [];
    }

    try {
      const {
        productId,
        warehouseId,
        locationId,
        actionType,
        startDate,
        endDate,
        referenceId,
        referenceType,
        limit = 100,
        skip = 0,
        sort = { createdAt: -1 },
      } = options;

      const query: any = {};

      if (productId) query.productId = productId;
      if (warehouseId) query.warehouseId = warehouseId;
      if (locationId) query.locationId = locationId;
      if (actionType) {
        if (Array.isArray(actionType)) {
          query.actionType = { $in: actionType };
        } else {
          query.actionType = actionType;
        }
      }

      if (startDate && endDate) {
        query.createdAt = { $gte: startDate, $lte: endDate };
      } else if (startDate) {
        query.createdAt = { $gte: startDate };
      } else if (endDate) {
        query.createdAt = { $lte: endDate };
      }

      if (referenceId) query.referenceId = referenceId;
      if (referenceType) query.referenceType = referenceType;

      return this.inventoryLogModel
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      console.error('Error finding inventory logs:', error);
      return [];
    }
  }

  async findById(id: string): Promise<InventoryLog | null> {
    if (!this.isMongoEnabled || !this.inventoryLogModel) {
      return null;
    }
    
    try {
      return this.inventoryLogModel.findById(id).exec();
    } catch (error) {
      console.error(`Error finding inventory log with ID ${id}:`, error);
      return null;
    }
  }

  async findByProductId(
    productId: number,
    options: Omit<InventoryLogQueryOptions, 'productId'> = {},
  ): Promise<InventoryLog[]> {
    return this.findAll({ ...options, productId });
  }

  async findByWarehouseId(
    warehouseId: number,
    options: Omit<InventoryLogQueryOptions, 'warehouseId'> = {},
  ): Promise<InventoryLog[]> {
    return this.findAll({ ...options, warehouseId });
  }

  async findByActionType(
    actionType: InventoryActionType | InventoryActionType[],
    options: Omit<InventoryLogQueryOptions, 'actionType'> = {},
  ): Promise<InventoryLog[]> {
    return this.findAll({ ...options, actionType: actionType as string | string[] });
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    options: Omit<InventoryLogQueryOptions, 'startDate' | 'endDate'> = {},
  ): Promise<InventoryLog[]> {
    return this.findAll({ ...options, startDate, endDate });
  }

  async findByReference(
    referenceId: number,
    referenceType: string,
    options: Omit<InventoryLogQueryOptions, 'referenceId' | 'referenceType'> = {},
  ): Promise<InventoryLog[]> {
    return this.findAll({ ...options, referenceId, referenceType });
  }

  async countLogs(query: Partial<InventoryLogQueryOptions> = {}): Promise<number> {
    if (!this.isMongoEnabled || !this.inventoryLogModel) {
      return 0;
    }
    
    try {
      return this.inventoryLogModel.countDocuments(query).exec();
    } catch (error) {
      console.error('Error counting inventory logs:', error);
      return 0;
    }
  }
}
