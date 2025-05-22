'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import POSLayout from '@/components/layouts/POSLayout';
import { posService } from '@/lib/api/services/pos';
import { shiftsService } from '@/lib/api/services/shifts';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { 
  ArrowTrendingUpIcon, 
  BanknotesIcon,
  ArrowRightIcon,
  ClockIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function POSDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeShift, setActiveShift] = useState<any | null>(null);
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [recentSales, setRecentSales] = useState<any[]>([]);

  useEffect(() => {
    checkShiftAndLoadData();
  }, []);

  const checkShiftAndLoadData = async () => {
    try {
      setLoading(true);
      
      // Check if there's an active shift
      const activeShiftResponse = await shiftsService.getActiveShift();
      setActiveShift(activeShiftResponse);
      
      // If no active shift, we should redirect to start shift
      if (!activeShiftResponse) {
        router.push('/pos/shifts');
        return;
      }
      
      // Load dashboard data
      const [dashboardStats, recentTransactions] = await Promise.all([
        posService.getDashboardStats(activeShiftResponse.id),
        posService.getRecentTransactions(5)
      ]);
      
      setDashboardData(dashboardStats);
      setRecentSales(recentTransactions);
    } catch (err) {
      console.error('Failed to load POS dashboard data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <POSLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Bảng điều khiển POS</h1>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Active shift info */}
            {activeShift && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex justify-between items-center">
                <div className="flex items-center">
                  <ClockIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <div>
                    <h3 className="font-medium">Ca hiện tại: {activeShift.name}</h3>
                    <p className="text-sm text-gray-600">Bắt đầu: {formatDateTime(activeShift.startTime)}</p>
                  </div>
                </div>
                <Link 
                  href="/pos/shifts" 
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  Chi tiết ca <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            )}
            
            {/* Dashboard stats */}
            {dashboardData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Doanh số hôm nay</p>
                      <p className="text-2xl font-semibold mt-1">
                        {formatCurrency(dashboardData.todaySales)}
                      </p>
                    </div>
                    <div className="rounded-full bg-green-100 p-3">
                      <BanknotesIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Giao dịch hôm nay</p>
                      <p className="text-2xl font-semibold mt-1">
                        {dashboardData.todayTransactions}
                      </p>
                    </div>
                    <div className="rounded-full bg-blue-100 p-3">
                      <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Doanh số ca hiện tại</p>
                      <p className="text-2xl font-semibold mt-1">
                        {formatCurrency(dashboardData.currentShiftSales)}
                      </p>
                    </div>
                    <div className="rounded-full bg-purple-100 p-3">
                      <ClockIcon className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Giao dịch ca hiện tại</p>
                      <p className="text-2xl font-semibold mt-1">
                        {dashboardData.currentShiftTransactions}
                      </p>
                    </div>
                    <div className="rounded-full bg-amber-100 p-3">
                      <ShieldCheckIcon className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick actions */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Thao tác nhanh</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <Link href="/pos/sales" className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                  <BanknotesIcon className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm text-center">Bán hàng</span>
                </Link>
                
                <Link href="/pos/shifts" className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition">
                  <ClockIcon className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm text-center">Ca làm việc</span>
                </Link>
                
                <Link href="/pos/warranty" className="flex flex-col items-center p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition">
                  <ShieldCheckIcon className="h-8 w-8 text-amber-600 mb-2" />
                  <span className="text-sm text-center">Bảo hành</span>
                </Link>
              </div>
            </div>
            
            {/* Recent sales */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Giao dịch gần đây</h2>
                  <Link 
                    href="/pos/sales" 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    Xem tất cả <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentSales.length > 0 ? (
                      recentSales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                            <Link href={`/pos/sales/${sale.id}`}>{sale.code}</Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(sale.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {sale.customerName || 'Khách lẻ'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(sale.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {sale.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-sm text-gray-500 text-center">
                          Không có giao dịch nào gần đây
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </POSLayout>
  );
}
