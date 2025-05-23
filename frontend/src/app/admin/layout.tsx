"use client";

import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Breadcrumb } from '@/components/admin/Breadcrumb';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fc]">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 ml-64">
          <Breadcrumb />
          <div className="mt-4">{children}</div>
        </main>
      </div>
    </div>
  );
}