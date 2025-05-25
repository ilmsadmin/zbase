"use client";

import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Breadcrumb } from '@/components/admin/Breadcrumb';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-orange-100">
      <AdminHeader />      <main className="flex-1 p-6 w-full">
        <Breadcrumb />
        <div className="mt-4">{children}</div>
      </main>
    </div>
  );
}