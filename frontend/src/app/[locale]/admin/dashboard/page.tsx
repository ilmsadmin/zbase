'use client';

import { useState, useEffect } from 'react';
import { 
  BanknotesIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  ArchiveBoxIcon,
  ArrowDownRightIcon,
  ArrowUpRightIcon
} from '@heroicons/react/24/outline';

import AdminLayout from '@/components/layouts/AdminLayout';
import DashboardCard from '@/components/admin/dashboard/DashboardCard';
import RecentActivityList from '@/components/admin/dashboard/RecentActivityList';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import POSStatusCard from '@/components/admin/dashboard/POSStatusCard';
import WarrantyStatusCard from '@/components/admin/dashboard/WarrantyStatusCard';
import LineChart from '@/components/ui/charts/LineChart';
import BarChart from '@/components/ui/charts/BarChart';
import PieChart from '@/components/ui/charts/PieChart';
import DonutChart from '@/components/ui/charts/DonutChart';
import AreaChart from '@/components/ui/charts/AreaChart';
import { dashboardService } from '@/lib/api/services/dashboard';
import { formatCurrency } from '@/lib/utils/format';
import { useTranslations } from 'next-intl';

export default function Dashboard() {
  const t = useTranslations('admin.dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);  const [salesData, setSalesData] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [inventoryStatusData, setInventoryStatusData] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [activeShift, setActiveShift] = useState<any>(null);
  const [warrantyStatus, setWarrantyStatus] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [error, setError] = useState<string | null>(null);  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [statsData, activityData, salesDataResponse, categoryDataResponse, inventoryStatusResponse] = 
          await Promise.all([
            dashboardService.getStats(),
            dashboardService.getRecentActivity(5),
            dashboardService.getSalesData(selectedPeriod),
            dashboardService.getProductCategoryDistribution(),
            dashboardService.getInventoryStatus()
          ]);
        
        // Mock data for POS and warranty which would come from API in a real app
        const mockActiveShiftData = {
          id: 1,
          name: 'Ca sáng 22/05/2025',
          startTime: '08:00 22/05/2025',
          cashier: 'Nguyễn Văn A',
          totalSales: 4750000,
          transactionCount: 12
        };

        const mockWarrantyStatusData = {
          pending: 5,
          inProgress: 12,
          completed: 43,
          total: 60
        };
        
        setStats(statsData);
        setRecentActivity(activityData);
        setSalesData(salesDataResponse);
        setCategoryData(categoryDataResponse);
        setInventoryStatusData(inventoryStatusResponse);
        setActiveShift(mockActiveShiftData);
        setWarrantyStatus(mockWarrantyStatusData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Không thể tải dữ liệu bảng điều khiển. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedPeriod]);
  // Use real data if available, otherwise fallback to example data
  const cardData = stats ? [
    {
      title: t('revenue.today'),
      value: formatCurrency(stats.revenue.today),
      trend: { 
        value: stats.revenue.previousPeriod.percentage, 
        isPositive: stats.revenue.previousPeriod.percentage > 0 
      },
      icon: <BanknotesIcon />,
      color: 'blue',
      description: t('revenue.description')
    },
    {
      title: t('orders.today'),
      value: stats.orders.total.toString(),
      trend: { 
        value: stats.orders.previousPeriod.percentage, 
        isPositive: stats.orders.previousPeriod.percentage > 0 
      },
      icon: <DocumentTextIcon />,
      color: 'green',
      description: t('orders.description', { pending: stats.orders.pending })
    },
    {
      title: t('customers.new'),
      value: stats.customers.new.toString(),
      trend: { 
        value: stats.customers.previousPeriod.percentage, 
        isPositive: stats.customers.previousPeriod.percentage > 0 
      },
      icon: <UsersIcon />,
      color: 'purple',
      description: t('customers.description')
    },
    {
      title: t('inventory.attention'),
      value: stats.inventory.lowStock.toString(),
      trend: { 
        value: 0, // No trend data for inventory in our model
        isPositive: false 
      },
      icon: <ArchiveBoxIcon />,
      color: 'red',
      description: t('inventory.description')
    }
  ] : [];
  // Map API data to the format expected by the RecentActivityList component
  const mapRecentActivityData = () => {
    if (!recentActivity || recentActivity.length === 0) {
      return [];
    }
    
    return recentActivity.map(activity => ({
      id: activity.id,
      type: activity.type as 'invoice' | 'inventory' | 'customer' | 'transaction' | 'warranty',
      title: activity.title,
      description: activity.description,
      time: activity.time,
      status: activity.status as 'completed' | 'pending' | 'error',
      link: activity.link
    }));
  };
  // Prepare chart data using the fetched data or use fallback data
  const prepareSalesData = () => {
    if (salesData && salesData.labels && salesData.data) {
      return {
        labels: salesData.labels,
        data: salesData.data
      };
    }
    
    // Fallback data
    const labels = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 29 + i);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });
    
    return {
      labels,
      data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 5000000) + 1000000)
    };
  };

  // Monthly revenue labels
  const monthlyRevenueLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  
  // Prepare product category data
  const prepareProductCategoryData = () => {
    if (categoryData && categoryData.labels && categoryData.data) {
      return categoryData;
    }
    
    // Fallback data
    return {
      labels: ['Điện thoại', 'Laptop', 'Máy tính bảng', 'Phụ kiện', 'Linh kiện', 'Khác'],
      data: [35, 25, 15, 12, 8, 5],
    };
  };
  
  // Prepare inventory status data
  const prepareInventoryData = () => {
    if (inventoryStatusData && inventoryStatusData.labels && inventoryStatusData.data) {
      return inventoryStatusData;
    }
    
    // Fallback data
    return {
      labels: ['Còn hàng', 'Sắp hết', 'Hết hàng', 'Quá tồn'],
      data: [65, 15, 10, 10],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6366f1'],
    };
  };

  // Mock data for POS and Warranty components
  const preparePOSData = () => {
    if (activeShift) return activeShift;
    
    // Fallback data
    return {
      id: 1,
      name: 'Ca sáng 22/05/2025',
      startTime: '08:00 22/05/2025',
      cashier: 'Nguyễn Văn A',
      totalSales: 4750000,
      transactionCount: 12
    };
  };

  const prepareWarrantyData = () => {
    if (warrantyStatus) return warrantyStatus;
    
    // Fallback data
    return {
      pending: 5,
      inProgress: 12,
      completed: 43,
      total: 60
    };
  };

  // Customer acquisition data
  const customerAcquisitionLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
  
  const salesChartData = prepareSalesData();
  const productCategoryData = prepareProductCategoryData();
  const inventoryData = prepareInventoryData();
    return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-sm text-gray-600 mt-1">{t('welcome')}</p>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Content - only show when not loading and no errors */}
        {!isLoading && !error && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {cardData.map((card, index: number) => (
                <DashboardCard 
                  key={index}
                  title={card.title}
                  value={card.value}
                  trend={card.trend}
                  icon={card.icon}
                  color={card.color as 'blue' | 'green' | 'red' | 'purple' | 'yellow'}
                  description={card.description}
                />
              ))}
            </div>
            
            {/* Quick Actions */}
            <QuickActions />

            {/* POS and Warranty Status Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <POSStatusCard activeShift={preparePOSData()} />
              <WarrantyStatusCard status={prepareWarrantyData()} />
            </div>
            
            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              <LineChart
                title={t('charts.sales.title')}
                subtitle={t('charts.sales.subtitle')}
                labels={salesChartData.labels}
                datasets={[
                  {
                    label: t('charts.sales.label'),
                    data: salesChartData.data,
                  }
                ]}
                height={350}
              />
              
              {/* Monthly Revenue by Category */}
              <BarChart
                title={t('charts.monthlyRevenue.title')}
                subtitle={t('charts.monthlyRevenue.subtitle')}
                labels={monthlyRevenueLabels}
                datasets={[
                  {
                    label: t('charts.monthlyRevenue.label'),
                    data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100000000) + 50000000),
                  }
                ]}
                height={350}
              />
            </div>
            
            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product Categories */}
              <PieChart
                title={t('charts.productCategories.title')}
                subtitle={t('charts.productCategories.subtitle')}
                labels={productCategoryData.labels}
                data={productCategoryData.data}
                height={300}
              />
              
              {/* Inventory Status */}
              <DonutChart
                title={t('charts.inventoryStatus.title')}
                subtitle={t('charts.inventoryStatus.subtitle')}
                labels={inventoryData.labels}
                data={inventoryData.data}
                backgroundColor={inventoryData.backgroundColor}
                height={300}
              />
              
              {/* Customer Acquisition */}
              <AreaChart
                title={t('charts.customerAcquisition.title')}
                subtitle={t('charts.customerAcquisition.subtitle')}
                labels={customerAcquisitionLabels}
                datasets={[
                  {
                    label: t('charts.customerAcquisition.label'),
                    data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 50) + 10),
                  }
                ]}
                height={300}
              />
            </div>
            
            {/* Recent Activities */}
            <RecentActivityList activities={mapRecentActivityData()} />
          </>
        )}
      </div>
    </AdminLayout>
  );
}
