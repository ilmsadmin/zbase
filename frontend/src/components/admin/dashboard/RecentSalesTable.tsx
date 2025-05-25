"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserAvatar } from '@/components/ui/ImageWithFallback';
import { dashboardService, RecentSale } from '@/lib/services/dashboardService';
import { formatCurrency, formatDate } from '@/utils/formatters';

export const RecentSalesTable = () => {
  const [sales, setSales] = useState<RecentSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentSales = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getRecentSales({ limit: 5 });
        setSales(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching recent sales:', err);
        setError('Failed to load recent sales data');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSales();
  }, []);
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex flex-col">      <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Đơn hàng gần đây</h2>
          <div className="animate-pulse h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        
        <div className="overflow-x-auto -mx-6">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider text-left">
                <th className="py-3 px-6">Invoice</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-28"></div>
                    </div>
                  </td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 bg-gray-200 rounded-full w-4"></div>
                      <div className="h-4 bg-gray-200 rounded-full w-4"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Recent Sales</h2>
          <Link href="/admin/invoices" className="text-sm text-orange-500 hover:text-orange-600">
            View All
          </Link>
        </div>
        
        <div className="flex-grow bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={() => setLoading(true)} // Trigger a re-fetch
            className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  
  // Calculate total revenue
  const totalRevenue = sales.reduce((acc, sale) => acc + sale.amount, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Đơn hàng gần đây</h2>
        <Link href="/admin/invoices" className="text-sm text-orange-500 hover:text-orange-600">
          Xem tất cả
        </Link>
      </div>
      
      {sales.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-gray-500 text-sm">
          Không có dữ liệu đơn hàng gần đây
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider text-left">
                <th className="py-3 px-6">Hóa đơn</th>
                <th className="py-3 px-6">Khách hàng</th>
                <th className="py-3 px-6">Ngày</th>
                <th className="py-3 px-6">Số tiền</th>
                <th className="py-3 px-6">Trạng thái</th>
                <th className="py-3 px-6">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-gray-800">{sale.invoiceNumber}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <UserAvatar 
                          src={undefined} // API doesn't provide customer image
                          alt={sale.customerName}
                          size="small"
                          initials={sale.customerName.charAt(0)}
                        />
                      </div>
                      <span className="text-sm text-gray-800">{sale.customerName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-500">{formatDate(sale.date, 'full')}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-gray-800">{formatCurrency(sale.amount)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sale.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : sale.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Link href={`/admin/invoices/${sale.id}`} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </Link>
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-500">Tổng đơn hàng: </span>
            <span className="font-medium text-gray-800">{sales.length}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Tổng số tiền: </span>
            <span className="font-medium text-gray-800">{formatCurrency(totalRevenue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
