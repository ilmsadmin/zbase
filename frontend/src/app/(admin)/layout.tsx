'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
    return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        {/* Simple header without navbar */}
        <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
          <div className="w-full px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-2xl font-bold">
                  ZBase
                </Link>
                <span className="text-orange-200 text-sm font-medium">Admin Panel</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-orange-100">
                  Xin chào, {user?.firstName} {user?.lastName}
                </span>
                <Link 
                  href="/logout" 
                  className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  Đăng xuất
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area without sidebar */}
        <main className="w-full">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
