import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  UserGroupIcon, 
  ExclamationTriangleIcon,
  ArrowDownIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { dashboardService } from '@/lib/api/services/dashboard';

// Define types for dashboard data
interface DashboardStat {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  bgClass: string;
}

interface RecentTransaction {
  id: number;
  customer: string;
  date: string;
  amount: string;
  status: string;
  statusColor?: string;
}

interface TopProduct {
  id: number;
  name: string;
  sold: number;
  revenue: string;
  stock: number;
}

interface LowStockItem {
  id: number;
  name: string;
  current: number;
  minimum: number;
}

// Fallback demo data in case API fails
const fallbackStatsData = [
  { 
    title: 'Doanh thu hôm nay', 
    value: '8.500.000đ', 
    change: '+12.5%', 
    isPositive: true, 
    icon: <CurrencyDollarIcon className="h-6 w-6 text-green-600" />,
    bgClass: 'bg-green-50'
  },
  { 
    title: 'Đơn hàng hôm nay', 
    value: '24', 
    change: '+2.0%', 
    isPositive: true, 
    icon: <ShoppingCartIcon className="h-6 w-6 text-blue-600" />,
    bgClass: 'bg-blue-50'
  },
  { 
    title: 'Khách hàng mới', 
    value: '5', 
    change: '-10.5%', 
    isPositive: false, 
    icon: <UserGroupIcon className="h-6 w-6 text-purple-600" />,
    bgClass: 'bg-purple-50'
  },
  { 
    title: 'Sản phẩm tồn kho thấp', 
    value: '8', 
    change: '+3', 
    isPositive: false, 
    icon: <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />,
    bgClass: 'bg-amber-50'
  },
];

const fallbackRecentTransactions = [
  { id: 1, customer: 'Nguyễn Văn A', date: '22/05/2025', amount: '450.000 đ', status: 'Hoàn thành' },
  { id: 2, customer: 'Trần Thị B', date: '21/05/2025', amount: '1.200.000 đ', status: 'Hoàn thành' },
  { id: 3, customer: 'Lê Văn C', date: '21/05/2025', amount: '850.000 đ', status: 'Đang xử lý' },
  { id: 4, customer: 'Phạm Thị D', date: '20/05/2025', amount: '3.600.000 đ', status: 'Hoàn thành' },
  { id: 5, customer: 'Vũ Văn E', date: '20/05/2025', amount: '750.000 đ', status: 'Hủy' },
];

const fallbackTopProducts = [
  { id: 1, name: 'iPhone 14 Pro', sold: 28, revenue: '42.000.000 đ', stock: 15 },
  { id: 2, name: 'Samsung Galaxy S23', sold: 24, revenue: '31.200.000 đ', stock: 8 },
  { id: 3, name: 'MacBook Air M2', sold: 18, revenue: '45.000.000 đ', stock: 5 },
  { id: 4, name: 'iPad Pro 11"', sold: 16, revenue: '22.400.000 đ', stock: 12 },
  { id: 5, name: 'AirPods Pro', sold: 15, revenue: '7.500.000 đ', stock: 25 },
];

const fallbackLowStockItems = [
  { id: 1, name: 'Samsung Galaxy S23', current: 8, minimum: 10 },
  { id: 2, name: 'MacBook Air M2', current: 5, minimum: 10 },
  { id: 3, name: 'Xiaomi 13 Pro', current: 3, minimum: 10 },
  { id: 4, name: 'iPhone 14', current: 7, minimum: 10 },
];

export default function AdminDashboard() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const [statsData, setStatsData] = useState<DashboardStat[]>(fallbackStatsData);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>(fallbackRecentTransactions);
  const [topProducts, setTopProducts] = useState<TopProduct[]>(fallbackTopProducts);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>(fallbackLowStockItems);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch stats
        const stats = await dashboardService.getStats(period);

        // Format stats with proper period label
        const periodLabel = getPeriodDisplayName();
        
        // Transform stats data
        const transformedStats = [
          { 
            title: `Doanh thu ${periodLabel}`, 
            value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.revenue || 0), 
            change: '+12.5%', // This would come from comparing with previous period
            isPositive: true, 
            icon: <CurrencyDollarIcon className="h-6 w-6 text-green-600" />,
            bgClass: 'bg-green-50'
          },
          { 
            title: `Đơn hàng ${periodLabel}`, 
            value: stats.orders.toString(), 
            change: '+2.0%', // This would come from comparing with previous period
            isPositive: true, 
            icon: <ShoppingCartIcon className="h-6 w-6 text-blue-600" />,
            bgClass: 'bg-blue-50'
          },
          { 
            title: `Khách hàng mới ${periodLabel}`, 
            value: stats.customers.toString(), 
            change: '+5.3%', // This would come from comparing with previous period
            isPositive: true, 
            icon: <UserGroupIcon className="h-6 w-6 text-purple-600" />,
            bgClass: 'bg-purple-50'
          },
          { 
            title: 'Sản phẩm tồn kho thấp', 
            value: stats.lowStock.toString(), 
            change: '+3', // This would come from comparing with previous period
            isPositive: false, 
            icon: <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />,
            bgClass: 'bg-amber-50'
          },
        ];
        
        setStatsData(transformedStats);
          // Fetch recent transactions with the selected period
        const recentSales = await dashboardService.getRecentSales(period);
        if (recentSales && recentSales.length > 0) {          // Format the transaction data for display
          const formattedSales = recentSales.map(sale => {
            const statusInfo = getInvoiceStatusDisplay(sale.status);
            
            return {
              id: sale.id,
              customer: sale.customer || 'Khách lẻ',
              date: new Date(sale.date).toLocaleDateString('vi-VN'),
              amount: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(sale.amount)),
              status: statusInfo.text,
              statusColor: statusInfo.colorClass
            };
          });
          setRecentTransactions(formattedSales);
        }
        
        // Fetch top products with the selected period
        const topSelling = await dashboardService.getTopProducts(period);
        if (topSelling && topSelling.length > 0) {
          // Format the product data for display
          const formattedProducts = topSelling.map(product => ({
            id: product.id,
            name: product.name,
            sold: product.totalQuantity,
            revenue: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.totalRevenue),
            stock: product.stockQuantity ?? 0 // Use stock data if available
          }));
          setTopProducts(formattedProducts);
        }
        
        // Fetch low stock items (period doesn't apply to inventory status)
        const lowStock = await dashboardService.getLowStockItems();
        if (lowStock && lowStock.length > 0) {
          // Format low stock data
          const formattedLowStock = lowStock.map(item => ({
            id: item.id,
            name: item.name,
            current: Number(item.quantity),
            minimum: 10 // This would come from product settings
          }));
          setLowStockItems(formattedLowStock);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Không thể tải dữ liệu dashboard. Đang sử dụng dữ liệu mẫu.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [period]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(e.target.value as 'day' | 'week' | 'month' | 'year');
  };
  // Helper function to get period display name
  const getPeriodDisplayName = () => {
    switch (period) {
      case 'day': return 'hôm nay';
      case 'week': return 'tuần này';
      case 'month': return 'tháng này';
      case 'year': return 'năm nay';
      default: return 'hôm nay';
    }
  };
  
  // Helper function to convert invoice status to UI display
  const getInvoiceStatusDisplay = (apiStatus: string): { text: string; colorClass: string } => {
    switch (apiStatus.toLowerCase()) {
      case 'paid':
        return { text: 'Hoàn thành', colorClass: 'bg-green-100 text-green-800' };
      case 'pending':
        return { text: 'Đang xử lý', colorClass: 'bg-blue-100 text-blue-800' };
      case 'canceled':
        return { text: 'Hủy', colorClass: 'bg-red-100 text-red-800' };
      default:
        return { text: apiStatus, colorClass: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center -mt-1">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div>
          <select 
            className="bg-white border border-gray-300 rounded-md py-2 px-3 text-sm"
            value={period}
            onChange={handlePeriodChange}
          >
            <option value="day">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>
      </div>
      
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({length: 4}).map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-20"></div>
            </div>
          ))
        ) : (
          statsData.map((stat, index) => (
            <div key={index} className={`${stat.bgClass} rounded-lg p-6 shadow-sm`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.isPositive ? (
                      <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} từ hôm qua
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-white">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Charts and Tables */}      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Doanh thu</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md">Ngày</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Tuần</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Tháng</button>
            </div>
          </div>
          <div className="h-72 w-full bg-gray-50 rounded flex items-center justify-center">
            {/* This would be replaced with an actual chart component */}
            <p className="text-gray-500">Biểu đồ doanh thu sẽ hiển thị ở đây</p>
          </div>
        </div>
        
        {/* Top Products */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Sản phẩm bán chạy</h2>
            <Link href="/admin/reports/products" className="text-sm text-blue-600 hover:text-blue-800">
              Xem tất cả
            </Link>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="h-64 w-full bg-gray-50 animate-pulse rounded flex items-center justify-center">
                <p className="text-gray-400">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đã bán
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doanh thu
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tồn kho
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-500">
                        {product.sold}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-500">
                        {product.revenue}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-500">
                        {product.stock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Đơn hàng gần đây</h2>
            <Link href="/admin/sales/invoices" className="text-sm text-blue-600 hover:text-blue-800">
              Xem tất cả
            </Link>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="h-64 w-full bg-gray-50 animate-pulse rounded flex items-center justify-center">
                <p className="text-gray-400">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số tiền
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {tx.customer}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{tx.date}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-500">
                        {tx.amount}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.statusColor || 'bg-gray-100 text-gray-800'}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        {/* Low Stock Alert */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Cảnh báo tồn kho thấp</h2>
            <Link href="/admin/warehouses/inventory" className="text-sm text-blue-600 hover:text-blue-800">
              Quản lý tồn kho
            </Link>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="h-64 w-full bg-gray-50 animate-pulse rounded flex items-center justify-center">
                <p className="text-gray-400">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hiện tại
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tối thiểu
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lowStockItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className="text-red-600 font-medium">{item.current}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500">
                        {item.minimum}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                        <Link href={`/admin/warehouses/transfer?product=${item.id}&type=nhap`} className="text-blue-600 hover:text-blue-900">
                          Nhập hàng
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
