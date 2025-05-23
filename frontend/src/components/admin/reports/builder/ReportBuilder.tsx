import { useState } from 'react';
import { Card, Button } from '@/components/ui';
import MetricSelector from './MetricSelector';
import FilterBuilder from './FilterBuilder';
import VisualizationOptions from './VisualizationOptions';
import ScheduleOptions from './ScheduleOptions';
import ReportPreview from './ReportPreview';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getMetricOptions, runCustomReport, saveCustomReport } from '@/services/api/reports';
import type { FilterOption, VisualizationOption } from '@/services/api/reports';

export default function ReportBuilder() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [visualization, setVisualization] = useState<VisualizationOption>({
    type: 'bar',
    title: 'Custom Report',
  });
  const [showSchedule, setShowSchedule] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'metrics' | 'filters' | 'visualization' | 'preview'>('metrics');
  
  const { data: metricOptions, isLoading: loadingMetrics } = useQuery({
    queryKey: ['metricOptions'],
    queryFn: getMetricOptions,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  
  const { mutate: runReport, data: reportData, isLoading: isRunningReport } = useMutation({
    mutationFn: () => runCustomReport(selectedMetrics, filters, visualization),
  });
  
  const { mutate: saveReport, isLoading: isSavingReport } = useMutation({
    mutationFn: () => saveCustomReport({
      name: reportName,
      description: reportDescription,
      metrics: selectedMetrics,
      filters,
      visualization,
    }),
    onSuccess: () => {
      // Show success toast
      setReportName('');
      setReportDescription('');
    },
  });
  
  const handleRunReport = () => {
    if (selectedMetrics.length === 0) {
      // Show error message
      return;
    }
    
    runReport();
    setActiveTab('preview');
  };
  
  const handleSaveReport = () => {
    if (!reportName || selectedMetrics.length === 0) {
      // Show error message
      return;
    }
    
    saveReport();
  };
  
  const mockMetricOptions = [
    { id: 'revenue', name: 'Revenue', category: 'sales', dataType: 'currency' },
    { id: 'order_count', name: 'Order Count', category: 'sales', dataType: 'number' },
    { id: 'average_order', name: 'Average Order Value', category: 'sales', dataType: 'currency' },
    { id: 'product_sales', name: 'Product Sales', category: 'products', dataType: 'number' },
    { id: 'product_revenue', name: 'Product Revenue', category: 'products', dataType: 'currency' },
    { id: 'stock_level', name: 'Stock Level', category: 'inventory', dataType: 'number' },
    { id: 'stock_value', name: 'Stock Value', category: 'inventory', dataType: 'currency' },
    { id: 'customer_count', name: 'Customer Count', category: 'customers', dataType: 'number' },
    { id: 'customer_purchases', name: 'Customer Purchases', category: 'customers', dataType: 'number' },
    { id: 'profit_margin', name: 'Profit Margin', category: 'finance', dataType: 'percentage' },
  ];
  
  const displayMetrics = metricOptions || mockMetricOptions;
  
  return (
    <div className="space-y-6">
      <Card>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold">Custom Report Builder</h2>
              <div className="flex space-x-1">
                <div 
                  className={`w-2 h-2 rounded-full ${selectedMetrics.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}
                  title="Metrics"
                ></div>
                <div 
                  className={`w-2 h-2 rounded-full ${filters.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}
                  title="Filters"
                ></div>
                <div 
                  className={`w-2 h-2 rounded-full ${visualization.title !== 'Custom Report' ? 'bg-green-500' : 'bg-gray-300'}`}
                  title="Visualization"
                ></div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleRunReport}
                disabled={selectedMetrics.length === 0 || isRunningReport}
              >
                {isRunningReport ? 'Running...' : 'Run Report'}
              </Button>
              
              <Button 
                onClick={handleSaveReport}
                disabled={!reportName || selectedMetrics.length === 0 || isSavingReport}
              >
                {isSavingReport ? 'Saving...' : 'Save Report'}
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-4 mt-4">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'metrics' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('metrics')}
            >
              1. Select Metrics
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'filters' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('filters')}
            >
              2. Add Filters
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'visualization' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('visualization')}
            >
              3. Visualization
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'preview' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => activeTab === 'preview' || !reportData ? null : setActiveTab('preview')}
              disabled={!reportData}
            >
              Preview
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter report name"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="Enter report description"
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Metrics</h3>
                  {selectedMetrics.length === 0 ? (
                    <div className="text-gray-500 italic">No metrics selected</div>
                  ) : (
                    <div className="space-y-2">
                      {selectedMetrics.map((metricId) => {
                        const metric = displayMetrics.find((m) => m.id === metricId);
                        return (
                          <div key={metricId} className="flex justify-between items-center p-2 bg-blue-50 rounded-md">
                            <div>
                              <div className="font-medium">{metric?.name}</div>
                              <div className="text-xs text-gray-500">{metric?.category}</div>
                            </div>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => setSelectedMetrics(selectedMetrics.filter((id) => id !== metricId))}
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Available Metrics</h3>
                {loadingMetrics ? (
                  <div className="animate-pulse h-64 bg-gray-100 rounded-md"></div>
                ) : (
                  <MetricSelector
                    metrics={displayMetrics}
                    selectedMetrics={selectedMetrics}
                    onSelectMetric={(metricId) => {
                      if (!selectedMetrics.includes(metricId)) {
                        setSelectedMetrics([...selectedMetrics, metricId]);
                      }
                    }}
                  />
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'filters' && (
            <FilterBuilder
              filters={filters}
              metrics={displayMetrics}
              onAddFilter={(filter) => setFilters([...filters, filter])}
              onRemoveFilter={(index) => {
                const newFilters = [...filters];
                newFilters.splice(index, 1);
                setFilters(newFilters);
              }}
              onUpdateFilter={(index, filter) => {
                const newFilters = [...filters];
                newFilters[index] = filter;
                setFilters(newFilters);
              }}
            />
          )}
          
          {activeTab === 'visualization' && (
            <div className="space-y-6">
              <VisualizationOptions
                visualization={visualization}
                metrics={displayMetrics}
                selectedMetrics={selectedMetrics}
                onUpdate={setVisualization}
              />
              
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Schedule Report (Optional)</h3>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="scheduleToggle"
                    checked={showSchedule}
                    onChange={(e) => setShowSchedule(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="scheduleToggle">Schedule this report</label>
                </div>
                
                {showSchedule && (
                  <ScheduleOptions
                    onUpdate={(schedule) => {
                      // Handle schedule update
                    }}
                  />
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'preview' && (
            <ReportPreview
              loading={isRunningReport}
              data={reportData}
              visualization={visualization}
              onExport={(format) => {
                // Handle export
              }}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
