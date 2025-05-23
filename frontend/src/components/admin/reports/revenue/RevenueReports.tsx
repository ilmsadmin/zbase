import { useState } from 'react';
import { Card, Tabs, DateRangePicker } from '@/components/ui';
import RevenueChart from './RevenueChart';
import RevenueTable from './RevenueTable';
import { useQuery } from '@tanstack/react-query';
import { getRevenueReport } from '@/services/api/reports';
import { 
  ArrowDownTrayIcon, 
  DocumentTextIcon, 
  TableCellsIcon 
} from '@heroicons/react/24/outline';
import { exportReport } from '@/services/api/reports';
import { format, subDays } from 'date-fns';

type GroupByOption = 'day' | 'week' | 'month';

export default function RevenueReports() {
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  
  const [groupBy, setGroupBy] = useState<GroupByOption>('day');
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');
  
  const { data: revenueData, isLoading } = useQuery({
    queryKey: ['revenueReport', dateRange, groupBy],
    queryFn: () => getRevenueReport(dateRange, groupBy),
    staleTime: 5 * 60 * 1000,
  });

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      const blob = await exportReport('revenue', { 
        dateRange, 
        groupBy 
      }, format);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue-report-${dateRange.startDate}-to-${dateRange.endDate}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
      // Show error toast
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="w-full sm:w-auto">
          <DateRangePicker
            value={{
              from: new Date(dateRange.startDate),
              to: new Date(dateRange.endDate)
            }}
            onChange={(range) => {
              if (range?.from && range?.to) {
                setDateRange({
                  startDate: format(range.from, 'yyyy-MM-dd'),
                  endDate: format(range.to, 'yyyy-MM-dd')
                });
              }
            }}
          />
        </div>
        
        <div className="flex space-x-2">
          <select 
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as GroupByOption)}
          >
            <option value="day">Group by Day</option>
            <option value="week">Group by Week</option>
            <option value="month">Group by Month</option>
          </select>
          
          <div className="relative inline-block">
            <button className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm flex items-center">
              <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
              Export
              <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
              <div className="py-1">
                <button 
                  onClick={() => handleExport('pdf')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as PDF
                </button>
                <button 
                  onClick={() => handleExport('excel')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as Excel
                </button>
                <button 
                  onClick={() => handleExport('csv')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Card>
        <div className="p-4 border-b">
          <Tabs>
            <Tabs.List>
              <Tabs.Trigger 
                value="chart" 
                active={activeTab === 'chart'} 
                onClick={() => setActiveTab('chart')}
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Chart View
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="table" 
                active={activeTab === 'table'} 
                onClick={() => setActiveTab('table')}
              >
                <TableCellsIcon className="h-4 w-4 mr-2" />
                Table View
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </div>
        
        <div className="p-6">
          {activeTab === 'chart' ? (
            <RevenueChart data={revenueData} isLoading={isLoading} groupBy={groupBy} />
          ) : (
            <RevenueTable data={revenueData} isLoading={isLoading} />
          )}
        </div>
      </Card>
    </div>
  );
}
