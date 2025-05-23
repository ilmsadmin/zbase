"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserMenu } from './UserMenu';

export const AdminHeader = () => {
  const pathname = usePathname();

  // Menu items for horizontal navigation
  const menuItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Inventory', path: '/admin/inventory' },
    { name: 'Warehouses', path: '/admin/warehouses' },
    { name: 'Customers', path: '/admin/customers' },
    { name: 'Invoices', path: '/admin/invoices' },
    { name: 'Transactions', path: '/admin/transactions' },
    { name: 'Reports', path: '/admin/reports' },
    { name: 'Settings', path: '/admin/settings' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center">
          {/* Logo and brand section */}
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/admin" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                ZBase
              </span>
              <span className="ml-2 text-sm text-gray-600 font-medium">Admin</span>
            </Link>
            <UserMenu />
          </div>

          {/* Navigation menu */}
          <nav className="border-t border-gray-200 md:border-0 overflow-x-auto">
            <ul className="flex px-4 md:px-6 space-x-6 h-12">
              {menuItems.map((item) => (
                <li key={item.path} className="flex-shrink-0">
                  <Link 
                    href={item.path} 
                    className={`inline-flex h-full items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                      pathname === item.path || pathname.startsWith(`${item.path}/`)
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
