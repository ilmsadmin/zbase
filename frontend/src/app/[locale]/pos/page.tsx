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
      setError(null);
      
      // Check if user has an active shift
      const shiftStatus = await posService.checkActiveShift();
      
      if (!shiftStatus.hasActiveShift) {
        // No active shift, redirect to the shifts page
        router.push('/pos/shifts');
        return;
      }
      
      setActiveShift(shiftStatus.shiftData);
      
      // Load dashboard data
      const [dashData, salesData] = await Promise.all([
        posService.getDashboardData(),
        posService.getRecentSales(1, 5)
      ]);
      
      setDashboardData(dashData);
      setRecentSales(salesData.items);
    } catch (err: any) {
      console.error('Error loading POS dashboard:', err);
      setError(err.message || 'Failed to load POS dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <POSLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </POSLayout>
    );
  }

  if (error) {
    return (
      <POSLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={checkShiftAndLoadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </POSLayout>
    );
  }

  return (
    <POSLayout>
      <div className="flex flex-col h-full">
        {/* Shift info header */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium mb-1">Active Shift</h2>
              <p className="text-gray-600 text-sm">
                <ClockIcon className="h-4 w-4 inline mr-1" />
                Started: {formatDateTime(activeShift?.startTime)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Warehouse: <span className="font-medium">{activeShift?.warehouse?.name}</span></div>
              <div className="text-sm text-gray-600">Starting amount: <span className="font-medium">{formatCurrency(activeShift?.startAmount)}</span></div>
            </div>
          </div>
        </div>

        {/* Dashboard summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData?.totalSales || 0)}</div>
            <div className="mt-2 text-sm text-gray-600">
              {dashboardData?.totalInvoices || 0} transactions
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Cash Received</h3>
              <BanknotesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData?.cashReceived || 0)}</div>
            <div className="mt-2 text-sm text-gray-600">
              Cash payments
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Card Received</h3>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData?.cardReceived || 0)}</div>
            <div className="mt-2 text-sm text-gray-600">
              Card payments
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Link 
            href="/pos/sales"
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg shadow-sm flex items-center justify-between transition-colors"
          >
            <div>
              <h3 className="text-xl font-medium mb-2">New Sale</h3>
              <p className="text-blue-100">Create a new transaction</p>
            </div>
            <ArrowRightIcon className="h-6 w-6" />
          </Link>
          
          <Link 
            href="/pos/warranty" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-lg shadow-sm flex items-center justify-between transition-colors"
          >
            <div>
              <h3 className="text-xl font-medium mb-2">Warranty Lookup</h3>
              <p className="text-indigo-100">Check warranty status</p>
            </div>
            <ShieldCheckIcon className="h-6 w-6" />
          </Link>
        </div>

        {/* Recent sales */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 className="font-medium">Recent Sales</h3>
            <Link 
              href="/pos/sales"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </Link>
          </div>
          
          <div className="overflow-y-auto h-96 px-6 py-2">
            {recentSales.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="py-3">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">{sale.code}</div>
                      <div className="text-green-600 font-medium">{formatCurrency(sale.totalAmount)}</div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <div>
                        {sale.customer ? sale.customer.name : 'Walk-in Customer'} 
                        <span className="mx-2">•</span> 
                        {formatDateTime(sale.createdAt)}
                      </div>
                      <div className={`${
                        sale.paymentMethod === 'cash' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {sale.paymentMethod === 'cash' ? 'Cash' : 'Card'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
                <p>No recent sales</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </POSLayout>
  );
}
