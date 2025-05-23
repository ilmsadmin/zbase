"use client";

import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Breadcrumb } from '@/components/admin/Breadcrumb';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fc]">
      <AdminHeader />
      <main className="flex-1 p-6 container mx-auto max-w-7xl">
        <Breadcrumb />
        <div className="mt-4">{children}</div>
      </main>
    </div>
  );
}