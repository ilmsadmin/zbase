"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductImage } from '@/components/ui/ImageWithFallback';
import { dashboardService, TopProduct } from '@/lib/services/dashboardService';
import { formatCurrency, formatNumber } from '@/utils/formatters';

export const TopProductsWidget = () => {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getTopProducts({ 
          limit: 5,
          period
        });
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching top products:', err);
        setError('Failed to load top products');
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [period]);

  // Calculate total quantity sold for percentage calculations
  const totalQuantitySold = products.reduce((acc, p) => acc + p.quantitySold, 0);
  // Calculate total revenue
  const totalRevenue = products.reduce((acc, p) => acc + p.revenue, 0);
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex flex-col">        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Sản phẩm bán chạy</h2>
          <div className="animate-pulse h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        
        <div className="overflow-hidden">
          <ul className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <li key={i} className="flex items-center animate-pulse">
                <div className="bg-gray-200 rounded-lg w-10 h-10 mr-3"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="ml-3">
                  <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-8"></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Sản phẩm bán chạy</h2>
        <div className="flex items-center">
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="text-sm border-gray-200 rounded-md mr-3 py-1 px-2"
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </select>
          <Link href="/admin/products" className="text-sm text-orange-500 hover:text-orange-600">
            Xem tất cả
          </Link>
        </div>
      </div>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex-grow">
          <p>{error}</p>
          <button 
            onClick={() => setPeriod(period)} // Re-fetch by "changing" to the same period
            className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
          >
            Thử lại
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="flex items-center justify-center flex-grow text-gray-500 text-sm">
          Không có dữ liệu bán hàng cho giai đoạn này
        </div>
      ) : (
        <div className="overflow-hidden">
          <ul className="space-y-4">
            {products.map((product) => (
              <li key={product.id} className="flex items-center">
                <div className="bg-gray-100 rounded-lg w-10 h-10 flex items-center justify-center overflow-hidden mr-3">
                  <ProductImage
                    src={product.imageUrl || ''}
                    alt={product.name}
                    size="small"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>SKU: {product.sku}</span>
                    <span className="mx-1">•</span>
                    <span>Đã bán: {product.quantitySold}</span>
                  </div>
                </div>
                <div className="ml-3 text-right">
                  <p className="text-sm font-medium text-gray-800">{formatCurrency(product.revenue)}</p>
                  <p className="text-xs text-gray-500">
                    {totalQuantitySold ? ((product.quantitySold / totalQuantitySold) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-500">Tổng đã bán: </span>
            <span className="font-medium text-gray-800">{formatNumber(totalQuantitySold)} sản phẩm</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Doanh thu: </span>
            <span className="font-medium text-gray-800">{formatCurrency(totalRevenue)}</span>
          </div>
        </div>
      </div>
    </div>
    );
};
