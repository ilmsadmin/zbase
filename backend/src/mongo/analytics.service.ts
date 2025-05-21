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

  // Report Analytics Methods - Added for Reports Module
  async getSalesAnalytics(startDate: Date, endDate: Date): Promise<any> {
    if (!this.isMongoEnabled || !this.salesAnalyticsModel) {
      return {
        message: 'MongoDB is not enabled, using mock sales analytics data',
        data: this.getMockSalesData(startDate, endDate)
      };
    }

    try {
      const query: any = {};
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = startDate;
        if (endDate) query.date.$lte = endDate;
      }

      const data = await this.salesAnalyticsModel
        .find(query)
        .sort({ date: -1 })
        .exec();

      return {
        timeRange: { startDate, endDate },
        summary: this.aggregateSalesData(data),
        details: data
      };
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      return {
        error: 'Failed to fetch sales analytics',
        mockData: this.getMockSalesData(startDate, endDate)
      };
    }
  }

  async getInventoryAnalytics(startDate: Date, endDate: Date): Promise<any> {
    // This would connect to inventory logs collection in a real implementation
    return {
      timeRange: { startDate, endDate },
      summary: {
        totalProducts: 250,
        lowStockItems: 15,
        outOfStockItems: 3,
        totalValue: 125000,
        fastMovingItems: ['Product A', 'Product B', 'Product C'],
        slowMovingItems: ['Product X', 'Product Y', 'Product Z'],
      },
      stockDistribution: {
        warehouse1: 45,
        warehouse2: 35,
        warehouse3: 20,
      },
      categoryDistribution: {
        'Category A': 30,
        'Category B': 25,
        'Category C': 45,
      },
      details: this.getMockInventoryData()
    };
  }

  async getCustomerAnalytics(startDate: Date, endDate: Date): Promise<any> {
    return {
      timeRange: { startDate, endDate },
      summary: {
        totalCustomers: 1250,
        newCustomers: 75,
        activeCustomers: 650,
        churnRate: 2.5,
        averageOrderValue: 120,
        customerLifetimeValue: 2500,
      },
      segmentation: {
        'High Value': 150,
        'Regular': 500,
        'Occasional': 400,
        'New': 200,
      },
      purchaseFrequency: {
        'Weekly': 100,
        'Monthly': 350,
        'Quarterly': 450,
        'Yearly': 350,
      },
      details: this.getMockCustomerData()
    };
  }

  async getFinancialAnalytics(startDate: Date, endDate: Date): Promise<any> {
    return {
      timeRange: { startDate, endDate },
      summary: {
        totalRevenue: 250000,
        totalCost: 150000,
        grossProfit: 100000,
        grossMargin: 40,
        operatingExpenses: 50000,
        netProfit: 50000,
        netMargin: 20,
      },
      revenueByChannel: {
        'In-Store': 150000,
        'Online': 75000,
        'Wholesale': 25000,
      },
      revenueByProduct: {
        'Product Category A': 100000,
        'Product Category B': 75000,
        'Product Category C': 50000,
        'Other': 25000,
      },
      monthlyTrend: this.getMockFinancialTrend(startDate, endDate),
    };
  }
  // Helper methods for mock data generation
  private getMockSalesData(startDate: Date, endDate: Date): any[] {
    const mockData: any[] = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    
    while (currentDate <= end) {
      mockData.push({
        date: new Date(currentDate),
        totalSales: Math.floor(Math.random() * 10000) + 1000,
        totalInvoices: Math.floor(Math.random() * 100) + 10,
        totalCustomers: Math.floor(Math.random() * 50) + 5,
        totalItems: Math.floor(Math.random() * 200) + 20,
        productSales: {
          'Product A': Math.floor(Math.random() * 1000) + 100,
          'Product B': Math.floor(Math.random() * 1000) + 100,
          'Product C': Math.floor(Math.random() * 1000) + 100,
        },
        hourlyDistribution: {
          '9-11': Math.floor(Math.random() * 30) + 10,
          '11-13': Math.floor(Math.random() * 40) + 20,
          '13-15': Math.floor(Math.random() * 35) + 15,
          '15-17': Math.floor(Math.random() * 30) + 10,
          '17-19': Math.floor(Math.random() * 45) + 25,
        }
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return mockData;
  }

  private aggregateSalesData(data: any[]): any {
    // Simple aggregation for demo
    return {
      totalSales: data.reduce((sum, item) => sum + item.totalSales, 0),
      totalInvoices: data.reduce((sum, item) => sum + item.totalInvoices, 0),
      totalCustomers: data.reduce((sum, item) => sum + item.totalCustomers, 0),
      totalItems: data.reduce((sum, item) => sum + item.totalItems, 0),
      averageOrderValue: data.length ? 
        data.reduce((sum, item) => sum + item.totalSales, 0) / data.reduce((sum, item) => sum + item.totalInvoices, 0) : 0,
    };
  }

  private getMockInventoryData(): any[] {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      productName: `Product ${String.fromCharCode(65 + i)}`,
      sku: `SKU-${1000 + i}`,
      quantity: Math.floor(Math.random() * 100) + 10,
      reorderLevel: 15,
      value: (Math.floor(Math.random() * 100) + 10) * 10,
      category: `Category ${Math.floor(i / 3) + 1}`,
      warehouse: `Warehouse ${(i % 3) + 1}`,
    }));
  }

  private getMockCustomerData(): any[] {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Customer ${String.fromCharCode(65 + i)}`,
      email: `customer${String.fromCharCode(97 + i)}@example.com`,
      totalPurchases: Math.floor(Math.random() * 20) + 1,
      totalSpent: (Math.floor(Math.random() * 100) + 10) * 10,
      lastPurchase: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      segment: i < 3 ? 'High Value' : i < 6 ? 'Regular' : 'Occasional',
    }));
  }
  private getMockFinancialTrend(startDate: Date, endDate: Date): any[] {
    const mockTrend: any[] = [];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    
    let currentMonth = startMonth;
    let currentYear = startYear;
    
    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
      mockTrend.push({
        month: months[currentMonth],
        year: currentYear,
        revenue: Math.floor(Math.random() * 50000) + 10000,
        cost: Math.floor(Math.random() * 30000) + 5000,
        profit: Math.floor(Math.random() * 20000) + 5000,
      });
      
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
    
    return mockTrend;
  }
}
