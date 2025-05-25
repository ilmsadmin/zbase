"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductImage } from '@/components/ui/ImageWithFallback';
import { dashboardService, LowStockItem } from '@/lib/services/dashboardService';

export const LowStockAlerts = () => {
  const [items, setItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getLowStockItems({ limit: 5 });
        setItems(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching low stock items:', err);
        setError('Failed to load low stock items');
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockItems();
  }, []);
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Cảnh báo hàng tồn kho thấp</h2>
          <div className="animate-pulse h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        
        <ul className="space-y-3 overflow-y-auto">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="flex items-center p-3 border border-gray-100 rounded-lg animate-pulse">
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
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Cảnh báo hàng tồn kho thấp</h2>
          <Link href="/admin/inventory" className="text-sm text-orange-500 hover:text-orange-600">
            Xem tất cả
          </Link>
        </div>
        
        <div className="flex-grow bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={() => setLoading(true)} // Trigger a re-fetch
            className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }
  
  // Sort by severity (difference between current and min stock)
  const sortedItems = [...items].sort((a, b) => {
    const aDiff = a.minStockLevel - a.currentStock;
    const bDiff = b.minStockLevel - b.currentStock;
    return bDiff - aDiff;
  });
  
  // Count critical items (30% or less of min stock)
  const criticalItemsCount = items.filter(item => 
    item.currentStock <= item.minStockLevel * 0.3
  ).length;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Cảnh báo hàng tồn kho thấp</h2>
        <Link href="/admin/inventory" className="text-sm text-orange-500 hover:text-orange-600">
          Xem tất cả
        </Link>
      </div>
      
      {sortedItems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Không có mặt hàng tồn kho thấp</p>
        </div>
      ) : (
        <ul className="space-y-3 overflow-y-auto">
          {sortedItems.map((item) => (
            <li key={item.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
              <div className="bg-gray-100 rounded-lg w-10 h-10 flex items-center justify-center overflow-hidden mr-3">
                <ProductImage
                  src={item.imageUrl || ''}
                  alt={item.name}
                  size="small"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="truncate">SKU: {item.sku}</span>
                  <span className="mx-1">•</span>
                  <span className="truncate">{item.warehouseName}</span>
                </div>
              </div>
              <div className="ml-3 flex flex-col items-end">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    item.currentStock <= item.minStockLevel * 0.3
                      ? 'bg-red-100 text-red-800'
                      : item.currentStock <= item.minStockLevel * 0.6
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.currentStock} / {item.minStockLevel}
                  </span>
                </div>
                <div className="mt-1 flex space-x-1">
                  <Link 
                    href={`/admin/inventory/adjustments/new?productId=${item.id}`}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Nhập thêm
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-500">Mặt hàng khẩn cấp: </span>
            <span className="font-medium text-red-600">
              {criticalItemsCount}
            </span>
          </div>
          <button className="px-3 py-1 text-sm rounded-md bg-orange-100 text-orange-600 font-medium hover:bg-orange-200">
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};
