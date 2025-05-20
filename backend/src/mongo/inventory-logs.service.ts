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
    @Optional() @InjectModel(InventoryLog.name) private readonly inventoryLogModel?: Model<InventoryLog>,
  ) {
    this.isMongoEnabled = !!this.inventoryLogModel;
  }

  async create(createLogDto: CreateInventoryLogDto): Promise<InventoryLog | null> {
    if (!this.isMongoEnabled) {
      console.warn('MongoDB is not enabled, inventory log not created');
      return null;
    }

    const createdLog = new this.inventoryLogModel(createLogDto);
    return createdLog.save();
  }

  async findAll(options: InventoryLogQueryOptions = {}): Promise<InventoryLog[]> {
    if (!this.isMongoEnabled) {
      console.warn('MongoDB is not enabled, returning empty array');
      return [];
    }

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

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    if (referenceId && referenceType) {
      query.referenceId = referenceId;
      query.referenceType = referenceType;
    }

    return this.inventoryLogModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findById(id: string): Promise<InventoryLog | null> {
    if (!this.isMongoEnabled) {
      console.warn('MongoDB is not enabled, returning null');
      return null;
    }

    return this.inventoryLogModel.findById(id).exec();
  }

  async countDocuments(options: InventoryLogQueryOptions = {}): Promise<number> {
    if (!this.isMongoEnabled) {
      return 0;
    }

    const {
      productId,
      warehouseId,
      locationId,
      actionType,
      startDate,
      endDate,
      referenceId,
      referenceType,
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

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    if (referenceId && referenceType) {
      query.referenceId = referenceId;
      query.referenceType = referenceType;
    }

    return this.inventoryLogModel.countDocuments(query).exec();
  }
}
