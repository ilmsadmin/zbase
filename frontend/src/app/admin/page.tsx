"use client";

import React from 'react';
import { StatsCardGrid } from '@/components/admin/dashboard/StatsCardGrid';
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart';
import { TopProductsWidget } from '@/components/admin/dashboard/TopProductsWidget';
import { RecentSalesTable } from '@/components/admin/dashboard/RecentSalesTable';
import { LowStockAlerts } from '@/components/admin/dashboard/LowStockAlerts';
import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Grid } from '@/components/ui/GridFlex';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex space-x-2">
          <select className="bg-white border border-gray-200 rounded-md text-sm px-3 py-2 shadow-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This month</option>
            <option>This year</option>
          </select>
        </div>
      </div>
      
      <StatsCardGrid />
      
      <Grid cols={1} lgCols={3} gap={6}>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products</CardDescription>
          </CardHeader>
          <CardContent>
            <TopProductsWidget />
          </CardContent>
        </Card>
      </Grid>
      
      <Grid cols={1} lgCols={3} gap={6}>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSalesTable />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Items needing attention</CardDescription>
          </CardHeader>
          <CardContent>
            <LowStockAlerts />
          </CardContent>
        </Card>
      </Grid>

      <Grid cols={1} lgCols={2} gap={6}>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Scheduled activities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-6">No upcoming tasks</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>System updates and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-6">No new notifications</p>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}
