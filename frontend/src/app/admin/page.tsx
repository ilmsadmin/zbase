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
    <div className="space-y-8">      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Tổng quan</h1>
        <div className="flex space-x-2">
          <select className="bg-white border border-gray-200 rounded-md text-sm px-3 py-2 shadow-sm">
            <option>7 ngày qua</option>
            <option>30 ngày qua</option>
            <option>Tháng này</option>
            <option>Năm nay</option>
          </select>
        </div>
      </div>
      
      <StatsCardGrid />
      
      <Grid cols={1} lgCols={3} gap={6}>
        <Card className="lg:col-span-2">          <CardHeader>
            <CardTitle>Tổng quan doanh thu</CardTitle>
            <CardDescription>Hiệu suất doanh thu theo tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
            <CardDescription>Sản phẩm bán chạy nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <TopProductsWidget />
          </CardContent>
        </Card>
      </Grid>
      
      <Grid cols={1} lgCols={3} gap={6}>        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>Các giao dịch mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSalesTable />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cảnh báo hàng tồn kho thấp</CardTitle>
            <CardDescription>Các mặt hàng cần chú ý</CardDescription>
          </CardHeader>
          <CardContent>
            <LowStockAlerts />
          </CardContent>
        </Card>
      </Grid>

      <Grid cols={1} lgCols={2} gap={6}>        <Card>
          <CardHeader>
            <CardTitle>Công việc sắp tới</CardTitle>
            <CardDescription>Hoạt động đã lên lịch</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-6">Không có công việc sắp tới</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Thông báo</CardTitle>
            <CardDescription>Cập nhật và cảnh báo hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-6">Không có thông báo mới</p>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}
