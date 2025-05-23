"use client";

import React from 'react';
import { StatsCardGrid } from '@/components/admin/dashboard/StatsCardGrid';
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart';
import { TopProductsWidget } from '@/components/admin/dashboard/TopProductsWidget';
import { RecentSalesTable } from '@/components/admin/dashboard/RecentSalesTable';
import { LowStockAlerts } from '@/components/admin/dashboard/LowStockAlerts';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      
      <StatsCardGrid />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <TopProductsWidget />
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentSalesTable />
        </div>
        <div>
          <LowStockAlerts />
        </div>
      </div>
    </div>
  );
}
