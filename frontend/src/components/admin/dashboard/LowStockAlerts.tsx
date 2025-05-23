"use client";

import React from 'react';
import Link from 'next/link';
import { ProductImage } from '@/components/ui/ImageWithFallback';

interface LowStockItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  imageUrl?: string;
  category: string;
  warehouseId: string;
  warehouseName: string;
}

export const LowStockAlerts = () => {
  // In a real app, this data would come from API calls
  const lowStockItems: LowStockItem[] = [
    {
      id: '1',
      name: 'iPhone 13 Pro Max',
      currentStock: 5,
      minStock: 10,
      imageUrl: '/product-1.jpg',
      category: 'Smartphones',
      warehouseId: 'wh1',
      warehouseName: 'Main Warehouse'
    },
    {
      id: '2',
      name: 'Samsung Galaxy S22 Ultra',
      currentStock: 3,
      minStock: 8,
      imageUrl: '/product-2.jpg',
      category: 'Smartphones',
      warehouseId: 'wh1',
      warehouseName: 'Main Warehouse'
    },
    {
      id: '3',
      name: 'Macbook Pro M2',
      currentStock: 2,
      minStock: 5,
      imageUrl: '/product-3.jpg',
      category: 'Laptops',
      warehouseId: 'wh2',
      warehouseName: 'Electronics Warehouse'
    },
    {
      id: '4',
      name: 'iPad Air 5',
      currentStock: 4,
      minStock: 10,
      imageUrl: '/product-4.jpg',
      category: 'Tablets',
      warehouseId: 'wh1',
      warehouseName: 'Main Warehouse'
    },
    {
      id: '5',
      name: 'Sony WH-1000XM4',
      currentStock: 6,
      minStock: 15,
      imageUrl: '/product-6.jpg',
      category: 'Headphones',
      warehouseId: 'wh2',
      warehouseName: 'Electronics Warehouse'
    }
  ];
  
  // Sort by severity (difference between current and min stock)
  const sortedItems = [...lowStockItems].sort((a, b) => {
    const aDiff = a.minStock - a.currentStock;
    const bDiff = b.minStock - b.currentStock;
    return bDiff - aDiff;
  });
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Low Stock Alerts</h2>
        <Link href="/admin/inventory" className="text-sm text-orange-500 hover:text-orange-600">
          View All
        </Link>
      </div>
      
      {sortedItems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-sm">No low stock items</p>
        </div>
      ) : (
        <ul className="space-y-3 overflow-y-auto">
          {sortedItems.map((item) => (
            <li key={item.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">              <div className="bg-gray-100 rounded-lg w-10 h-10 flex items-center justify-center overflow-hidden mr-3">
                <ProductImage
                  src={item.imageUrl}
                  alt={item.name}
                  size="small"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="truncate">{item.category}</span>
                  <span className="mx-1">•</span>
                  <span className="truncate">{item.warehouseName}</span>
                </div>
              </div>
              <div className="ml-3 flex flex-col items-end">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    item.currentStock <= item.minStock * 0.3
                      ? 'bg-red-100 text-red-800'
                      : item.currentStock <= item.minStock * 0.6
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.currentStock} / {item.minStock}
                  </span>
                </div>
                <div className="mt-1 flex space-x-1">
                  <Link 
                    href={`/admin/inventory/adjustments/new?productId=${item.id}&warehouseId=${item.warehouseId}`}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Restock
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
            <span className="text-gray-500">Critical Items: </span>
            <span className="font-medium text-red-600">
              {lowStockItems.filter(item => item.currentStock <= item.minStock * 0.3).length}
            </span>
          </div>
          <button className="px-3 py-1 text-sm rounded-md bg-orange-100 text-orange-600 font-medium hover:bg-orange-200">
            Order Inventory
          </button>
        </div>
      </div>
    </div>
  );
};
