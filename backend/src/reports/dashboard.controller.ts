import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { RequirePermissions } from '../permissions/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { AnalyticsService } from '../mongo/analytics.service';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('reports/dashboard')
export class DashboardController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly analyticsService: AnalyticsService,
    private readonly prisma: PrismaService
  ) {}

  /**
   * Helper method to calculate the start date based on period
   * @param period 'day' | 'week' | 'month' | 'year'
   * @returns Start date for the given period
   */
  private getStartDateByPeriod(period: string = 'day'): Date {
    const now = new Date();
    const start = new Date(now);
    
    switch (period) {
      case 'day': 
        start.setHours(0, 0, 0, 0); 
        break;
      case 'week': 
        start.setDate(now.getDate() - 7); 
        break;
      case 'month': 
        start.setMonth(now.getMonth() - 1); 
        break;
      case 'year': 
        start.setFullYear(now.getFullYear() - 1); 
        break;
      default: 
        start.setHours(0, 0, 0, 0);
    }
    
    return start;
  }

  /**
   * Helper method to calculate date range based on period
   */
  private getDateRange(period: string, startDate?: string, endDate?: string): { start: Date, end: Date } {
    let start: Date;
    let end: Date = new Date();
    
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      start = this.getStartDateByPeriod(period);
    }

    return { start, end };
  }

  @Get('stats')
  @RequirePermissions('reports.dashboard.read')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getDashboardStats(
    @Query('period') period: string = 'day',
  ) {
    try {
      const startDate = this.getStartDateByPeriod(period);
      const now = new Date();

      // Get total revenue for the period
      const revenueResult = await this.prisma.invoice.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: 'paid',
          invoiceDate: {
            gte: startDate,
            lte: now,
          },
        },
      });
      
      // Get total invoices for the period
      const orderCount = await this.prisma.invoice.count({
        where: {
          invoiceDate: {
            gte: startDate,
            lte: now,
          },
        },
      });

      // Get new customers for the period
      const newCustomers = await this.prisma.customer.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: now,
          },
        },
      });

      // Get low stock count (inventory with quantity below threshold)
      const lowStockThreshold = new Decimal(10); // Configure as needed
      const lowStockCount = await this.prisma.inventory.count({
        where: {
          quantity: {
            lt: lowStockThreshold,
          },
        },
      });

      return {
        revenue: revenueResult._sum.totalAmount || 0,
        orders: orderCount,
        customers: newCustomers,
        lowStock: lowStockCount,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        revenue: 0,
        orders: 0,
        customers: 0,
        lowStock: 0,
      };
    }
  }
  @Get('recent-sales')
  @RequirePermissions('reports.dashboard.read')
  @ApiOperation({ summary: 'Get recent sales/transactions' })
  async getRecentSales(
    @Query('period') period: string = 'day',
    @Query('limit') limit: number = 5,
  ) {
    try {
      const startDate = this.getStartDateByPeriod(period);
      const now = new Date();

      const recentInvoices = await this.prisma.invoice.findMany({
        where: {
          invoiceDate: {
            gte: startDate,
            lte: now,
          },
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            select: {
              id: true,
              quantity: true,
            },
          },
        },
        orderBy: {
          invoiceDate: 'desc',
        },
        take: limit,
      });

      return recentInvoices.map(invoice => ({
        id: invoice.id,
        date: invoice.invoiceDate,
        customer: invoice.customer ? invoice.customer.name : 'Walk-in Customer',
        email: invoice.customer?.email || '',
        amount: invoice.totalAmount,
        status: invoice.status,
        // Include total item count for frontend display
        itemCount: invoice.items.length,
      }));
    } catch (error) {
      console.error('Error fetching recent sales:', error);
      return [];
    }
  }
  @Get('top-products')
  @RequirePermissions('reports.dashboard.read')
  @ApiOperation({ summary: 'Get top selling products' })
  async getTopProducts(
    @Query('period') period: string = 'day',
    @Query('limit') limit: number = 5,
  ) {
    try {
      const startDate = this.getStartDateByPeriod(period);
      const now = new Date();

      // Get invoice items for paid invoices in the period
      const invoiceItems = await this.prisma.invoiceItem.findMany({
        where: {
          invoice: {
            status: 'paid',
            invoiceDate: {
              gte: startDate,
              lte: now,
            },
          },
        },        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              sku: true,
            },
          },
        },
      });

      // Aggregate items by product
      const productMap = new Map();
      
      for (const item of invoiceItems) {
        const productId = item.productId;
        if (!productMap.has(productId)) {          productMap.set(productId, {
            id: item.product.id,
            name: item.product.name,
            price: item.unitPrice, // Use the price from invoice item
            code: item.product.sku,
            totalQuantity: 0,
            totalRevenue: 0,
          });
        }
        
        const productData = productMap.get(productId);
        productData.totalQuantity = Number(productData.totalQuantity) + Number(item.quantity);
        productData.totalRevenue = Number(productData.totalRevenue) + Number(item.totalAmount);
      }

      // Get inventory data for these products
      const productIds = [...productMap.keys()];
      const inventoryData = await this.prisma.inventory.findMany({
        where: {
          productId: {
            in: productIds,
          },
        },
        include: {
          product: {
            select: {
              id: true,
            }
          }
        },
      });

      // Add inventory data to product info
      for (const inventory of inventoryData) {
        const productId = inventory.productId;
        if (productMap.has(productId)) {
          const productData = productMap.get(productId);
          productData.stockQuantity = Number(inventory.quantity) || 0;
        }
      }

      // Convert to array and sort by quantity sold
      const topProducts = Array.from(productMap.values())
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, limit);

      return topProducts;
    } catch (error) {
      console.error('Error fetching top products:', error);
      return [];
    }
  }

  @Get('low-stock')
  @RequirePermissions('reports.dashboard.read')
  @ApiOperation({ summary: 'Get low stock products' })
  async getLowStockProducts(
    @Query('threshold') thresholdParam: string = '10',
    @Query('limit') limit: number = 5,
  ) {
    try {
      const threshold = new Decimal(thresholdParam);
      
      const lowStockInventory = await this.prisma.inventory.findMany({
        where: {
          quantity: {
            lt: threshold,
          },
        },        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              sku: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
          warehouse: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          quantity: 'asc',
        },
        take: limit,
      });      return lowStockInventory.map(inventory => ({
        id: inventory.product.id,
        name: inventory.product.name,
        price: inventory.product.price,
        quantity: inventory.quantity,
        code: inventory.product.sku,
        category: inventory.product.category?.name || 'Uncategorized',
        warehouse: inventory.warehouse.name,
      }));
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      return [];
    }
  }

  @Get('sales-by-period')
  @RequirePermissions('reports.dashboard.read')
  @ApiOperation({ summary: 'Get sales data by period for charts' })
  async getSalesByPeriod(
    @Query('period') period: string = 'day',
  ) {
    try {
      const startDate = this.getStartDateByPeriod(period);
      const now = new Date();
      
      // Get all paid invoices in the period
      const invoices = await this.prisma.invoice.findMany({
        where: {
          status: 'paid',
          invoiceDate: {
            gte: startDate,
            lte: now,
          },
        },
        select: {
          invoiceDate: true,
          totalAmount: true,
        },
        orderBy: {
          invoiceDate: 'asc',
        },
      });

      // Format data based on period
      let groupedData: { label: string; value: number }[] = [];
      
      switch (period) {
        case 'day':
          // Group by hour
          groupedData = this.groupByHour(invoices);
          break;
        case 'week':
          // Group by day
          groupedData = this.groupByDay(invoices);
          break;
        case 'month':
          // Group by day
          groupedData = this.groupByDay(invoices);
          break;
        case 'year':
          // Group by month
          groupedData = this.groupByMonth(invoices);
          break;
        default:
          // Default to day
          groupedData = this.groupByHour(invoices);
      }

      return groupedData;
    } catch (error) {
      console.error('Error fetching sales by period:', error);
      return [];
    }
  }

  // Helper methods for grouping data
  private groupByHour(invoices: { invoiceDate: Date; totalAmount: Decimal }[]): { label: string; value: number }[] {
    const hourlyData = new Map();
    
    // Initialize with 0 for all 24 hours
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0');
      hourlyData.set(hour, 0);
    }

    // Sum up invoices by hour
    for (const invoice of invoices) {
      const hour = invoice.invoiceDate.getHours().toString().padStart(2, '0');
      hourlyData.set(hour, Number(hourlyData.get(hour) || 0) + Number(invoice.totalAmount));
    }

    // Convert to array format
    return Array.from(hourlyData).map(([hour, total]) => ({
      label: `${hour}:00`,
      value: Number(total),
    }));
  }

  private groupByDay(invoices: { invoiceDate: Date; totalAmount: Decimal }[]): { label: string; value: number }[] {
    const dailyData = new Map();
    const startDate = new Date(invoices.length > 0 ? invoices[0].invoiceDate : new Date());
    const endDate = new Date();
    
    // Initialize with 0 for all days in the range
    for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
      const dateKey = day.toISOString().split('T')[0];
      dailyData.set(dateKey, 0);
    }

    // Sum up invoices by day
    for (const invoice of invoices) {
      const dateKey = invoice.invoiceDate.toISOString().split('T')[0];
      dailyData.set(dateKey, Number(dailyData.get(dateKey) || 0) + Number(invoice.totalAmount));
    }

    // Convert to array format
    return Array.from(dailyData).map(([date, total]) => {
      const [year, month, day] = date.split('-');
      return {
        label: `${day}/${month}`,
        value: Number(total),
      };
    });
  }

  private groupByMonth(invoices: { invoiceDate: Date; totalAmount: Decimal }[]): { label: string; value: number }[] {
    const monthlyData = new Map();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize with 0 for all months
    for (let i = 0; i < 12; i++) {
      monthlyData.set(i, 0);
    }

    // Sum up invoices by month
    for (const invoice of invoices) {
      const month = invoice.invoiceDate.getMonth();
      monthlyData.set(month, Number(monthlyData.get(month) || 0) + Number(invoice.totalAmount));
    }

    // Convert to array format
    return Array.from(monthlyData).map(([month, total]) => ({
      label: monthNames[month],
      value: Number(total),
    }));
  }
}
