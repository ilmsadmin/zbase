"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import StockValueReport from './StockValueReport';
import MovementReport from './MovementReport';
import LowStockReport from './LowStockReport';
import ExpiryReport from './ExpiryReport';

export default function InventoryReports() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="stock-value">
        <TabsList>
          <TabsTrigger value="stock-value">Stock Value Report</TabsTrigger>
          <TabsTrigger value="movement">Movement Report</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock Report</TabsTrigger>
          <TabsTrigger value="expiry">Expiry Report</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stock-value">
          <StockValueReport />
        </TabsContent>
        <TabsContent value="movement">
          <MovementReport />
        </TabsContent>
        <TabsContent value="low-stock">
          <LowStockReport />
        </TabsContent>
        <TabsContent value="expiry">
          <ExpiryReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
