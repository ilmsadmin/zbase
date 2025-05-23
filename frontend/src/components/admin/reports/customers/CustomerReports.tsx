import { useState } from 'react';
import { Tabs } from '@/components/ui';
import CustomerRanking from './CustomerRanking';
import PurchaseAnalysis from './PurchaseAnalysis';
import DebtReports from './DebtReports';

export default function CustomerReports() {
  const [activeTab, setActiveTab] = useState('ranking');
  
  return (
    <div className="space-y-6">
      <Tabs>
        <Tabs.List>
          <Tabs.Trigger 
            value="ranking" 
            active={activeTab === 'ranking'} 
            onClick={() => setActiveTab('ranking')}
          >
            Customer Ranking
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="purchase-analysis" 
            active={activeTab === 'purchase-analysis'} 
            onClick={() => setActiveTab('purchase-analysis')}
          >
            Purchase Analysis
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="debt" 
            active={activeTab === 'debt'} 
            onClick={() => setActiveTab('debt')}
          >
            Debt Reports
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs>
      
      <div className="pt-4">
        {activeTab === 'ranking' && <CustomerRanking />}
        {activeTab === 'purchase-analysis' && <PurchaseAnalysis />}
        {activeTab === 'debt' && <DebtReports />}
      </div>
    </div>
  );
}
