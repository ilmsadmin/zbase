"use client";

import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { ReportProvider } from '@/components/contexts/ReportContext';

interface ReportsLayoutProps {
  children: React.ReactNode;
}

export default function ReportsLayout({ children }: ReportsLayoutProps) {
  return (
    <AdminLayout>
      <ReportProvider>
        {children}
      </ReportProvider>
    </AdminLayout>
  );
}
