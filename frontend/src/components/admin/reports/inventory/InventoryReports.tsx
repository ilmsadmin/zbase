import { useState } from 'react';
import { Tabs } from '@/components/ui';
import StockValueReport from './StockValueReport';
import MovementReport from './MovementReport';
import LowStockReport from './LowStockReport';
import ExpiryReport from './ExpiryReport';

export default function InventoryReports() {
  const [activeTab, setActiveTab] = useState('stock-value');
  
  return (
    <div className="space-y-6">
      <Tabs>
        <Tabs.List>
          <Tabs.Trigger 
            value="stock-value" 
            active={activeTab === 'stock-value'} 
            onClick={() => setActiveTab('stock-value')}
          >
            Stock Value Report
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="movement" 
            active={activeTab === 'movement'} 
            onClick={() => setActiveTab('movement')}
          >
            Movement Report
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="low-stock" 
            active={activeTab === 'low-stock'} 
            onClick={() => setActiveTab('low-stock')}
          >
            Low Stock Report
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="expiry" 
            active={activeTab === 'expiry'} 
            onClick={() => setActiveTab('expiry')}
          >
            Expiry Report
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs>
      
      <div className="pt-4">
        {activeTab === 'stock-value' && <StockValueReport />}
        {activeTab === 'movement' && <MovementReport />}
        {activeTab === 'low-stock' && <LowStockReport />}
        {activeTab === 'expiry' && <ExpiryReport />}
      </div>
    </div>
  );
}
