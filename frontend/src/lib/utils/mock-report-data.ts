/**
 * Mock data service for reports development
 * This can be easily replaced with real API calls when ready
 */

import { 
  ReportType, 
  SalesReportParams, 
  InventoryReportParams, 
  AccountsReceivableParams 
} from '@/lib/api/services/report';

/**
 * Flag to control whether to use mock data or real API calls
 * Set this to false when ready to use real data
 */
const USE_MOCK_DATA = true;

/**
 * Get mock data for sales reports
 */
function getMockSalesData(params: SalesReportParams) {
  // Generate realistic mock data based on params
  const { startDate, endDate, groupBy = 'day' } = params;
  
  // Parse dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate number of days between dates
  const dayDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate daily sales data
  const salesByDay = Array.from({ length: dayDiff + 1 }, (_, i) => {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    
    // Generate some random but realistic sales data
    const revenue = Math.round(5000 + Math.random() * 15000);
    const orders = Math.round(revenue / (50 + Math.random() * 30));
    
    return {
      date: date.toISOString().split('T')[0],
      revenue,
      orders,
      averageOrder: Math.round(revenue / orders)
    };
  });
  
  // Generate sales by product
  const salesByProduct = [
    { name: 'Product A', revenue: 45000, units: 150 },
    { name: 'Product B', revenue: 32000, units: 80 },
    { name: 'Product C', revenue: 28000, units: 140 },
    { name: 'Product D', revenue: 19500, units: 65 },
    { name: 'Product E', revenue: 14200, units: 71 },
  ];
  
  // Generate sales by category
  const salesByCategory = [
    { name: 'Electronics', revenue: 87000, percentage: 35 },
    { name: 'Furniture', revenue: 62000, percentage: 25 },
    { name: 'Clothing', revenue: 37200, percentage: 15 },
    { name: 'Kitchen', revenue: 33500, percentage: 13 },
    { name: 'Books', revenue: 24800, percentage: 10 },
    { name: 'Other', revenue: 5000, percentage: 2 },
  ];
  
  // Calculate summary metrics
  const totalSales = salesByDay.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = salesByDay.reduce((sum, day) => sum + day.orders, 0);
  const avgOrderValue = Math.round(totalSales / totalOrders);
  
  // Return structured data
  return {
    summary: {
      totalSales,
      totalOrders,
      avgOrderValue,
      topSellingProduct: salesByProduct[0].name,
      topSellingCategory: salesByCategory[0].name,
    },
    chartData: {
      salesByDay,
      salesByProduct,
      salesByCategory,
    },
    tableData: salesByDay.map(day => ({
      date: day.date,
      revenue: day.revenue,
      orders: day.orders,
      averageOrder: day.averageOrder,
    })),
  };
}

/**
 * Get mock data for inventory reports
 */
function getMockInventoryData(params: InventoryReportParams) {
  // Generate realistic mock data for inventory
  const { warehouseId, productId, categoryId, belowThreshold, asOfDate } = params;
  
  // Generate inventory items
  const inventoryItems = Array.from({ length: 50 }, (_, i) => {
    const id = i + 1;
    const stockLevel = Math.round(Math.random() * 200);
    const threshold = 20 + Math.round(Math.random() * 30);
    const isLowStock = stockLevel <= threshold;
    const isOutOfStock = stockLevel === 0;
    
    // Filter by below threshold if needed
    if (belowThreshold && !isLowStock) {
      return null;
    }
    
    const categories = ['Electronics', 'Furniture', 'Clothing', 'Kitchen', 'Books'];
    const category = categories[id % categories.length];
    
    // Filter by category if needed
    if (categoryId && category !== categories[(categoryId - 1) % categories.length]) {
      return null;
    }
    
    const warehouses = ['Main Warehouse', 'East Warehouse', 'West Warehouse', 'South Warehouse'];
    const warehouse = warehouses[id % warehouses.length];
    
    // Filter by warehouse if needed
    if (warehouseId && warehouse !== warehouses[(warehouseId - 1) % warehouses.length]) {
      return null;
    }
    
    return {
      id,
      sku: `PROD-${1000 + id}`,
      name: `Product ${id}`,
      category,
      warehouse,
      stockLevel,
      threshold,
      value: stockLevel * (10 + Math.random() * 90),
      isLowStock,
      isOutOfStock,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
  }).filter(Boolean);
  
  // Calculate summary metrics
  const totalProducts = inventoryItems.length;
  const lowStockItems = inventoryItems.filter(item => item.isLowStock).length;
  const outOfStockItems = inventoryItems.filter(item => item.isOutOfStock).length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + item.value, 0);
  
  // Generate stock by category
  const stockByCategory = inventoryItems.reduce((categories, item) => {
    if (!categories[item.category]) {
      categories[item.category] = {
        name: item.category,
        count: 0,
        value: 0,
      };
    }
    
    categories[item.category].count++;
    categories[item.category].value += item.value;
    
    return categories;
  }, {});
  
  // Generate stock by warehouse
  const stockByWarehouse = inventoryItems.reduce((warehouses, item) => {
    if (!warehouses[item.warehouse]) {
      warehouses[item.warehouse] = {
        name: item.warehouse,
        count: 0,
        value: 0,
      };
    }
    
    warehouses[item.warehouse].count++;
    warehouses[item.warehouse].value += item.value;
    
    return warehouses;
  }, {});
  
  return {
    summary: {
      totalProducts,
      lowStockItems,
      outOfStockItems,
      totalValue,
      avgProductValue: totalValue / totalProducts,
      asOfDate: asOfDate || new Date().toISOString().split('T')[0],
    },
    chartData: {
      stockByCategory: Object.values(stockByCategory),
      stockByWarehouse: Object.values(stockByWarehouse),
    },
    tableData: inventoryItems,
  };
}

/**
 * Get mock data for accounts receivable reports
 */
function getMockAccountsReceivableData(params: AccountsReceivableParams) {
  // Generate realistic mock AR data
  const { startDate, endDate, customerId, customerGroupId, agingPeriods } = params;
  
  // Generate customer AR entries
  const customers = [
    'Customer A Inc.',
    'Customer B Corp.',
    'Customer C LLC',
    'Customer D & Sons',
    'Customer E Products',
    'Customer F Services',
    'Customer G Manufacturing',
    'Customer H Retail',
  ];
  
  const customerGroups = [
    'Enterprise',
    'SMB',
    'Retail',
    'Government',
  ];
  
  const arEntries = Array.from({ length: 80 }, (_, i) => {
    const id = i + 1;
    const customer = customers[id % customers.length];
    const customerGroup = customerGroups[Math.floor(id / 20) % customerGroups.length];
    
    // Filter by customer if needed
    if (customerId && customer !== customers[(customerId - 1) % customers.length]) {
      return null;
    }
    
    // Filter by customer group if needed
    if (customerGroupId && customerGroup !== customerGroups[(customerGroupId - 1) % customerGroups.length]) {
      return null;
    }
    
    // Generate a random invoice date in the past
    const daysAgo = Math.floor(Math.random() * 120);
    const invoiceDate = new Date();
    invoiceDate.setDate(invoiceDate.getDate() - daysAgo);
    
    // Generate random due date (15-30 days after invoice)
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 15 + Math.floor(Math.random() * 15));
    
    const amount = 1000 + Math.round(Math.random() * 9000);
    const paid = daysAgo < 30 ? Math.round(Math.random() * amount) : amount;
    const balance = amount - paid;
    
    // Calculate aging bucket
    let agingBucket = '';
    const today = new Date();
    const daysPastDue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (balance === 0) {
      agingBucket = 'Paid';
    } else if (daysPastDue <= 0) {
      agingBucket = 'Current';
    } else if (daysPastDue <= 30) {
      agingBucket = '1-30 Days';
    } else if (daysPastDue <= 60) {
      agingBucket = '31-60 Days';
    } else if (daysPastDue <= 90) {
      agingBucket = '61-90 Days';
    } else {
      agingBucket = '90+ Days';
    }
    
    return {
      id,
      invoiceNumber: `INV-${10000 + id}`,
      customer,
      customerGroup,
      invoiceDate: invoiceDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      amount,
      paid,
      balance,
      agingBucket,
      daysPastDue: Math.max(0, daysPastDue),
    };
  }).filter(Boolean);
  
  // Calculate summary metrics
  const totalReceivables = arEntries.reduce((sum, entry) => sum + entry.balance, 0);
  const currentReceivables = arEntries
    .filter(entry => entry.agingBucket === 'Current')
    .reduce((sum, entry) => sum + entry.balance, 0);
  
  const overdueReceivables = totalReceivables - currentReceivables;
  
  // Calculate aging buckets
  const agingBuckets = arEntries.reduce((buckets, entry) => {
    if (!buckets[entry.agingBucket]) {
      buckets[entry.agingBucket] = 0;
    }
    
    buckets[entry.agingBucket] += entry.balance;
    
    return buckets;
  }, {});
  
  // Calculate receivables by customer
  const receivablesByCustomer = arEntries.reduce((customers, entry) => {
    if (!customers[entry.customer]) {
      customers[entry.customer] = {
        name: entry.customer,
        group: entry.customerGroup,
        total: 0,
        current: 0,
        overdue: 0,
      };
    }
    
    customers[entry.customer].total += entry.balance;
    
    if (entry.agingBucket === 'Current') {
      customers[entry.customer].current += entry.balance;
    } else {
      customers[entry.customer].overdue += entry.balance;
    }
    
    return customers;
  }, {});
  
  return {
    summary: {
      totalReceivables,
      currentReceivables,
      overdueReceivables,
      overduePercentage: Math.round((overdueReceivables / totalReceivables) * 100),
      avgDaysToPay: Math.round(arEntries.reduce((sum, entry) => sum + entry.daysPastDue, 0) / arEntries.length),
    },
    chartData: {
      agingBuckets: Object.entries(agingBuckets).map(([bucket, amount]) => ({
        name: bucket,
        amount,
      })),
      receivablesByCustomer: Object.values(receivablesByCustomer),
    },
    tableData: arEntries,
  };
}

/**
 * Service for fetching report data, either mock or real
 */
export const reportDataService = {
  /**
   * Get report data based on type and parameters
   * Will use mock data or real API depending on USE_MOCK_DATA flag
   */
  async getReportData(params: {
    type: ReportType;
    parameters: SalesReportParams | InventoryReportParams | AccountsReceivableParams;
  }) {
    if (USE_MOCK_DATA) {
      // Return mock data
      switch (params.type) {
        case ReportType.SALES:
          return getMockSalesData(params.parameters as SalesReportParams);
        
        case ReportType.INVENTORY:
          return getMockInventoryData(params.parameters as InventoryReportParams);
        
        case ReportType.ACCOUNTS_RECEIVABLE:
          return getMockAccountsReceivableData(params.parameters as AccountsReceivableParams);
        
        default:
          return {};
      }
    } else {
      // Call the real API
      const { reportService } = await import('@/lib/api/services/report');
      return reportService.getReportData(params);
    }
  },
};
