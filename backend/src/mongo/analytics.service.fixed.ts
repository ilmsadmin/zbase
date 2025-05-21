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
    @Optional() @InjectModel(SalesAnalytics.name) private salesAnalyticsModel: Model<SalesAnalytics> | null,
    @Optional() @InjectModel(AnalyticsReport.name) private analyticsReportModel: Model<AnalyticsReport> | null,
    @Optional() @InjectModel(ForecastingModel.name) private forecastingModelModel: Model<ForecastingModel> | null,
  ) {
    this.isMongoEnabled = !!(this.salesAnalyticsModel && this.analyticsReportModel && this.forecastingModelModel);
    
    if (!this.isMongoEnabled) {
      console.warn('MongoDB is not properly configured. Analytics functions will be disabled.');
    }
  }

  // Sales Analytics Methods
  async createSalesAnalytics(createDto: CreateSalesAnalyticsDto): Promise<SalesAnalytics | null> {
    if (!this.isMongoEnabled || !this.salesAnalyticsModel) {
      console.warn('MongoDB is not enabled, sales analytics not created');
      return null;
    }

    try {
      const createdAnalytics = new this.salesAnalyticsModel(createDto);
      return createdAnalytics.save();
    } catch (error) {
      console.error('Error creating sales analytics:', error);
      return null;
    }
  }

  async findSalesAnalytics(options: AnalyticsQueryOptions = {}): Promise<SalesAnalytics[]> {
    if (!this.isMongoEnabled || !this.salesAnalyticsModel) {
      return [];
    }

    try {
      const {
        startDate,
        endDate,
        warehouseId,
        limit = 100,
        skip = 0,
        sort = { date: -1 },
      } = options;

      const query: any = {};

      if (startDate && endDate) {
        query.date = { $gte: startDate, $lte: endDate };
      } else if (startDate) {
        query.date = { $gte: startDate };
      } else if (endDate) {
        query.date = { $lte: endDate };
      }

      if (warehouseId) {
        query.warehouseId = warehouseId;
      }

      return this.salesAnalyticsModel
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      console.error('Error finding sales analytics:', error);
      return [];
    }
  }

  // Analytics Reports Methods
  async createAnalyticsReport(createDto: CreateAnalyticsReportDto): Promise<AnalyticsReport | null> {
    if (!this.isMongoEnabled || !this.analyticsReportModel) {
      console.warn('MongoDB is not enabled, analytics report not created');
      return null;
    }

    try {
      const createdReport = new this.analyticsReportModel(createDto);
      return createdReport.save();
    } catch (error) {
      console.error('Error creating analytics report:', error);
      return null;
    }
  }

  async findAnalyticsReports(options: AnalyticsQueryOptions = {}): Promise<AnalyticsReport[]> {
    if (!this.isMongoEnabled || !this.analyticsReportModel) {
      return [];
    }

    try {
      const {
        type,
        startDate,
        endDate,
        limit = 100,
        skip = 0,
        sort = { createdAt: -1 },
      } = options;

      const query: any = {};

      if (type) {
        query.type = type;
      }

      if (startDate && endDate) {
        query.startDate = { $gte: startDate };
        query.endDate = { $lte: endDate };
      } else if (startDate) {
        query.startDate = { $gte: startDate };
      } else if (endDate) {
        query.endDate = { $lte: endDate };
      }

      return this.analyticsReportModel
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      console.error('Error finding analytics reports:', error);
      return [];
    }
  }

  async findAnalyticsReportById(id: string): Promise<AnalyticsReport | null> {
    if (!this.isMongoEnabled || !this.analyticsReportModel) {
      return null;
    }
    
    try {
      return this.analyticsReportModel.findById(id).exec();
    } catch (error) {
      console.error(`Error finding analytics report with ID ${id}:`, error);
      return null;
    }
  }

  // Forecasting Models Methods
  async createForecastingModel(createDto: CreateForecastingModelDto): Promise<ForecastingModel | null> {
    if (!this.isMongoEnabled || !this.forecastingModelModel) {
      console.warn('MongoDB is not enabled, forecasting model not created');
      return null;
    }

    try {
      const createdModel = new this.forecastingModelModel(createDto);
      return createdModel.save();
    } catch (error) {
      console.error('Error creating forecasting model:', error);
      return null;
    }
  }

  async findForecastingModels(options: AnalyticsQueryOptions = {}): Promise<ForecastingModel[]> {
    if (!this.isMongoEnabled || !this.forecastingModelModel) {
      return [];
    }

    try {
      const {
        limit = 100,
        skip = 0,
        sort = { createdAt: -1 },
      } = options;

      return this.forecastingModelModel
        .find()
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      console.error('Error finding forecasting models:', error);
      return [];
    }
  }

  async findForecastingModelById(id: string): Promise<ForecastingModel | null> {
    if (!this.isMongoEnabled || !this.forecastingModelModel) {
      return null;
    }
    
    try {
      return this.forecastingModelModel.findById(id).exec();
    } catch (error) {
      console.error(`Error finding forecasting model with ID ${id}:`, error);
      return null;
    }
  }

  async updateForecastingModel(
    id: string,
    updateDto: Partial<CreateForecastingModelDto>,
  ): Promise<ForecastingModel | null> {
    if (!this.isMongoEnabled || !this.forecastingModelModel) {
      return null;
    }
    
    try {
      return this.forecastingModelModel
        .findByIdAndUpdate(id, { $set: updateDto }, { new: true })
        .exec();
    } catch (error) {
      console.error(`Error updating forecasting model with ID ${id}:`, error);
      return null;
    }
  }
}
