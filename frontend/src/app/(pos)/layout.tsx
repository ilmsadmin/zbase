'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth';
import { UserRole } from '@/types';

export default function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER]}>
      <div className="min-h-screen flex flex-col">
        <header className="bg-primary text-primary-foreground py-2 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">ZBase POS</h1>
            <div className="flex items-center gap-4">
              <span className="text-xs bg-secondary px-2 py-1 rounded-full">Shift Active</span>
              <span className="text-sm">{user?.firstName} {user?.lastName}</span>
              <button 
                onClick={logout} 
                className="text-xs bg-primary-foreground/20 hover:bg-primary-foreground/30 px-2 py-1 rounded"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 flex">
          {children}
        </main>
        <footer className="bg-card border-t border-border py-2 px-4">
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">© 2025 ZBase POS</div>
            <div className="flex gap-4">
              <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm">Support</button>
              <button className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm">End Shift</button>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
