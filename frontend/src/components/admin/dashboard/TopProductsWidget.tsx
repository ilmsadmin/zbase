"use client";

import React from 'react';
import Link from 'next/link';
import { ProductImage } from '@/components/ui/ImageWithFallback';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  sold: number;
  revenue: number;
  stock: number;
}

export const TopProductsWidget = () => {
  // In a real app, this data would come from API calls
  const products: Product[] = [
    {
      id: '1',
      name: 'iPhone 13 Pro Max',
      price: 30500000,
      imageUrl: '/product-1.jpg',
      sold: 56,
      revenue: 1708000000,
      stock: 23
    },
    {
      id: '2',
      name: 'Samsung Galaxy S22 Ultra',
      price: 28500000,
      imageUrl: '/product-2.jpg',
      sold: 42,
      revenue: 1197000000,
      stock: 18
    },
    {
      id: '3',
      name: 'Macbook Pro M2',
      price: 42900000,
      imageUrl: '/product-3.jpg',
      sold: 24,
      revenue: 1029600000,
      stock: 10
    },
    {
      id: '4',
      name: 'iPad Air 5',
      price: 16900000,
      imageUrl: '/product-4.jpg',
      sold: 38,
      revenue: 642200000,
      stock: 15
    },
    {
      id: '5',
      name: 'AirPods Pro',
      price: 5990000,
      imageUrl: '/product-5.jpg',
      sold: 86,
      revenue: 515140000,
      stock: 42
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Top Products</h2>
        <Link href="/admin/products" className="text-sm text-orange-500 hover:text-orange-600">
          View All
        </Link>
      </div>
      
      <div className="overflow-hidden">
        <ul className="space-y-4">
          {products.map((product) => (
            <li key={product.id} className="flex items-center">              <div className="bg-gray-100 rounded-lg w-10 h-10 flex items-center justify-center overflow-hidden mr-3">
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name}
                  size="small"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span>₫{formatNumber(product.price)}</span>
                  <span className="mx-1">•</span>
                  <span>Sold: {product.sold}</span>
                  <span className="mx-1">•</span>
                  <span>Stock: {product.stock}</span>
                </div>
              </div>
              <div className="ml-3 text-right">
                <p className="text-sm font-medium text-gray-800">₫{formatNumber(product.revenue)}</p>
                <p className="text-xs text-gray-500">{((product.sold / products.reduce((acc, p) => acc + p.sold, 0)) * 100).toFixed(1)}%</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-500">Total Sold: </span>
            <span className="font-medium text-gray-800">{products.reduce((acc, p) => acc + p.sold, 0)} units</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Revenue: </span>
            <span className="font-medium text-gray-800">₫{formatNumber(products.reduce((acc, p) => acc + p.revenue, 0))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format numbers with commas
function formatNumber(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
