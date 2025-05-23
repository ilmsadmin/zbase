'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute, PermissionGuard } from '@/components/auth';
import { UserRole } from '@/types';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
      <div className="min-h-screen flex flex-col">
        <header className="bg-primary text-primary-foreground shadow-sm py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">ZBase Admin</h1>
            <div className="flex items-center gap-4">              <span className="text-sm">{user?.firstName} {user?.lastName}</span>
              <Link 
                href="/logout" 
                className="text-sm bg-primary-foreground/20 hover:bg-primary-foreground/30 px-3 py-1 rounded"
              >
                Đăng xuất
              </Link>
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <aside className="w-64 bg-card border-r border-border">
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <Link href="/admin" className="block p-2 rounded hover:bg-secondary">Dashboard</Link>
                </li>
                <li>
                  <Link href="/admin/products" className="block p-2 rounded hover:bg-secondary">Products</Link>
                </li>
                
                <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.INVENTORY]}>
                  <li>
                    <Link href="/admin/inventory" className="block p-2 rounded hover:bg-secondary">Inventory</Link>
                  </li>
                </PermissionGuard>
                
                <li>
                  <Link href="/admin/customers" className="block p-2 rounded hover:bg-secondary">Customers</Link>
                </li>
                <li>
                  <Link href="/admin/invoices" className="block p-2 rounded hover:bg-secondary">Invoices</Link>
                </li>
                
                <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                  <li>
                    <Link href="/admin/reports" className="block p-2 rounded hover:bg-secondary">Reports</Link>
                  </li>
                </PermissionGuard>
              </ul>
            </nav>
          </aside>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
