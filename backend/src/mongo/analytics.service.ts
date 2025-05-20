import { Injectable, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SalesAnalytics } from './schemas/sales-analytics.schema';
import { AnalyticsReport } from './schemas/analytics-report.schema';
import { ForecastingModel } from './schemas/forecasting-model.schema';

export interface CreateSalesAnalyticsDto {
  date: Date;
  totalSales: number;
  totalInvoices: number;
  totalCustomers: number;
  totalItems: number;
  productSales?: Record<string, number>;
  categorySales?: Record<string, number>;
  customerGroupSales?: Record<string, number>;
  hourlyDistribution?: Record<string, number>;
  warehouseId?: number;
  warehouseName?: string;
  metadata?: Record<string, any>;
}

export interface CreateAnalyticsReportDto {
  title: string;
  type: string;
  period: string;
  startDate: Date;
  endDate: Date;
  parameters?: Record<string, any>;
  data: any;
  chart?: string;
  summary?: string;
  userId?: number;
  userEmail?: string;
  isScheduled?: boolean;
  scheduleFrequency?: string;
  lastGeneratedAt?: Date;
}

export interface CreateForecastingModelDto {
  modelName: string;
  targetEntity: string;
  targetId: number;
  algorithm: string;
  parameters?: Record<string, any>;
  trainingData?: any;
  modelState?: any;
  accuracy?: number;
  lastTrainingDate?: Date;
  createdBy?: number;
  status?: string;
  description?: string;
}

export interface AnalyticsQueryOptions {
  type?: string;
  startDate?: Date;
  endDate?: Date;
  warehouseId?: number;
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
}

@Injectable()
export class AnalyticsService {
  private readonly isMongoEnabled: boolean;

  constructor(
    @Optional() @InjectModel(SalesAnalytics.name) private readonly salesAnalyticsModel?: Model<SalesAnalytics>,
    @Optional() @InjectModel(AnalyticsReport.name) private readonly analyticsReportModel?: Model<AnalyticsReport>,
    @Optional() @InjectModel(ForecastingModel.name) private readonly forecastingModelModel?: Model<ForecastingModel>,
  ) {
    this.isMongoEnabled = !!(this.salesAnalyticsModel && this.analyticsReportModel && this.forecastingModelModel);
  }

  // Sales Analytics Methods
  async createSalesAnalytics(createDto: CreateSalesAnalyticsDto): Promise<SalesAnalytics | null> {
    if (!this.isMongoEnabled) {
      console.warn('MongoDB is not enabled, sales analytics not created');
      return null;
    }

    const createdAnalytics = new this.salesAnalyticsModel(createDto);
    return createdAnalytics.save();
  }

  async findSalesAnalytics(options: AnalyticsQueryOptions = {}): Promise<SalesAnalytics[]> {
    if (!this.isMongoEnabled) {
      return [];
    }

    const {
      startDate,
      endDate,
      warehouseId,
      limit = 100,
      skip = 0,
      sort = { date: -1 },
    } = options;

    const query: any = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    if (warehouseId) query.warehouseId = warehouseId;

    return this.salesAnalyticsModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // Analytics Reports Methods
  async createAnalyticsReport(createDto: CreateAnalyticsReportDto): Promise<AnalyticsReport | null> {
    if (!this.isMongoEnabled) {
      console.warn('MongoDB is not enabled, analytics report not created');
      return null;
    }

    const createdReport = new this.analyticsReportModel(createDto);
    return createdReport.save();
  }

  async findAnalyticsReports(options: AnalyticsQueryOptions = {}): Promise<AnalyticsReport[]> {
    if (!this.isMongoEnabled) {
      return [];
    }

    const {
      type,
      startDate,
      endDate,
      limit = 100,
      skip = 0,
      sort = { createdAt: -1 },
    } = options;

    const query: any = {};

    if (type) query.type = type;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    return this.analyticsReportModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findAnalyticsReportById(id: string): Promise<AnalyticsReport | null> {
    if (!this.isMongoEnabled) {
      return null;
    }

    return this.analyticsReportModel.findById(id).exec();
  }

  // Forecasting Models Methods
  async createForecastingModel(createDto: CreateForecastingModelDto): Promise<ForecastingModel | null> {
    if (!this.isMongoEnabled) {
      console.warn('MongoDB is not enabled, forecasting model not created');
      return null;
    }

    const createdModel = new this.forecastingModelModel(createDto);
    return createdModel.save();
  }

  async findForecastingModels(options: AnalyticsQueryOptions = {}): Promise<ForecastingModel[]> {
    if (!this.isMongoEnabled) {
      return [];
    }

    const {
      limit = 100,
      skip = 0,
      sort = { createdAt: -1 },
    } = options;

    const query: any = {};

    return this.forecastingModelModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findForecastingModelById(id: string): Promise<ForecastingModel | null> {
    if (!this.isMongoEnabled) {
      return null;
    }

    return this.forecastingModelModel.findById(id).exec();
  }

  async updateForecastingModel(
    id: string,
    updateDto: Partial<CreateForecastingModelDto>,
  ): Promise<ForecastingModel | null> {
    if (!this.isMongoEnabled) {
      return null;
    }

    return this.forecastingModelModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }
}
