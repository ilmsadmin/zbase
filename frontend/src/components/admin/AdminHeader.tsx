"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserMenu } from './UserMenu';

export const AdminHeader = () => {
  const pathname = usePathname();
  // Menu items for horizontal navigation
  const menuItems = [
    { name: 'Tổng quan', path: '/admin' },
    { name: 'Sản phẩm', path: '/admin/products' },
    { name: 'Kho hàng', path: '/admin/inventory' },
    { name: 'Nhà kho', path: '/admin/warehouses' },
    { name: 'Khách hàng', path: '/admin/customers' },
    { name: 'Hóa đơn', path: '/admin/invoices' },
    { name: 'Giao dịch', path: '/admin/transactions' },
    { name: 'Báo cáo', path: '/admin/reports' },
    { name: 'Cài đặt', path: '/settings' },
  ];
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 shadow-sm">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center">          {/* Logo and brand section */}
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/admin" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                ZBase
              </span>
              <span className="ml-2 text-sm text-orange-700 font-medium">Admin</span>
            </Link>
          </div>          {/* Navigation menu */}
          <nav className="border-t border-orange-200 md:border-0 overflow-x-auto flex-grow">
            <ul className="flex px-4 md:px-6 space-x-6 h-12">
              {menuItems.map((item) => (
                <li key={item.path} className="flex-shrink-0">
                  <Link 
                    href={item.path}                    className={`inline-flex h-full items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors ${
                      (pathname === item.path || pathname?.startsWith(`${item.path}/`))
                        ? 'border-orange-600 text-orange-700 bg-orange-50/50'
                        : 'border-transparent text-orange-600 hover:border-orange-400 hover:text-orange-700 hover:bg-orange-50/30'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}            </ul>
          </nav>
          
          {/* User menu - moved to the right */}
          <div className="md:pr-6 py-2 md:py-0">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};
