"use client";

import { useState, useEffect, useMemo } from "react";
import { useReport } from "@/components/contexts/ReportContext";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import { 
  FiDownload, FiRefreshCw, FiFilter, FiCalendar, 
  FiPieChart, FiBarChart2, FiGrid, FiList, FiShare2, 
  FiSave, FiPlus, FiAlertTriangle, FiChevronDown
} from "react-icons/fi";
import { 
  ReportType, ReportFormat, ReportFrequency,
  Report, reportService, SalesReportParams
} from "@/lib/api/services/report";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { 
  ReportType, ReportFormat, ReportFrequency,
  Report, reportService, SalesReportParams
} from "@/lib/api/services/report";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Loading } from "@/components/ui/Loading";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils/format";
import { 
  downsampleTimeSeries, 
  optimizeCategoricalData, 
  shouldOptimizeChart 
} from "@/lib/utils/chart-optimization";
import { createReportShareURL } from "@/lib/utils/report-sharing";

// Chart components
import { BarChart, LineChart, PieChart } from "@/components/ui/charts";
import { DataTable, Column } from "@/components/ui/Table/DataTable";

export default function SalesReportsPage() {
  const t = useTranslations("admin.reports");
  const { 
    loading: reportLoading, 
    error: reportError,
    reportData,
    recentReports,
    fetchReportData,
    fetchRecentReports,
    generateReport,
    downloadReport,
    shareReport,
    optimizedChartData
  } = useReport();
  
  // State for date range
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  // State for group by
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');
  
  // State for report data
  const [reportData, setReportData] = useState<any>(null);
  
  // State for view mode
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  
  // State for chart type
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');

  // Loading state
  const [loading, setLoading] = useState(false);
  
  // Recent reports
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  
  // Fetch report data
  const fetchReportData = async () => {
    setLoading(true);
    try {
      const params: SalesReportParams = {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        groupBy: groupBy,
      };
      
      const data = await reportService.getReportData({
        type: ReportType.SALES,
        parameters: params,
      });
      
      setReportData(data);
    } catch (error) {
      console.error("Failed to fetch report data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch recent reports
  const fetchRecentReports = async () => {
    try {
      const { recentReports } = await reportService.getReportsSummary();
      setRecentReports(recentReports.filter(report => report.type === ReportType.SALES));
    } catch (error) {
      console.error("Failed to fetch recent reports:", error);
    }
  };
  
  // Generate report file
  const generateReport = async (format: ReportFormat) => {
    try {
      const reportData = {
        name: `Sales Report - ${formatDate(dateRange.from)} to ${formatDate(dateRange.to)}`,
        description: `Sales report grouped by ${groupBy}`,
        type: ReportType.SALES,
        format: format,
        parameters: {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
          groupBy: groupBy,
        },
        frequency: ReportFrequency.ONCE,
      };
      
      const result = await reportService.createReport(reportData);
      
      if (result && result.id) {
        const { fileUrl } = await reportService.generateReport(result.id);
        
        // Create download link
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = `sales_report_${new Date().getTime()}.${format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Refresh recent reports
        fetchRecentReports();
      }
    } catch (error) {
      console.error("Failed to generate report:", error);
    }
  };
  
  // Download existing report
  const downloadExistingReport = async (id: string) => {
    try {
      const blob = await reportService.downloadReport(id);
      const report = recentReports.find(r => r.id === id);
      
      if (report && report.fileUrl) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.name}.${report.format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to download report:", error);
    }
  };
  
  useEffect(() => {
    fetchReportData();
    fetchRecentReports();
  }, []);
  
  // Table columns for sales data
  const salesColumns: Column<any>[] = [
    {
      key: 'period',
      header: t('period'),
      render: (row) => <span>{row.period}</span>,
      sortable: true,
    },
    {
      key: 'totalSales',
      header: t('totalSales'),
      render: (row) => <span>{formatCurrency(row.totalSales)}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: 'invoiceCount',
      header: t('invoiceCount'),
      render: (row) => <span>{row.invoiceCount}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: 'averageOrder',
      header: t('averageOrder'),
      render: (row) => <span>{formatCurrency(row.averageOrder)}</span>,
      sortable: true,
      align: 'right',
    },
  ];
  
  // Recent reports columns
  const recentReportsColumns: Column<Report>[] = [
    {
      key: 'name',
      header: t('reportName'),
      render: (row) => <span>{row.name}</span>,
      sortable: true,
    },
    {
      key: 'format',
      header: t('format'),
      render: (row) => <span className="uppercase">{row.format}</span>,
      sortable: true,
    },
    {
      key: 'createdAt',
      header: t('createdAt'),
      render: (row) => <span>{formatDateTime(row.createdAt)}</span>,
      sortable: true,
    },
    {
      key: 'actions',
      header: t('actions'),
      render: (row) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => downloadExistingReport(row.id)}
            disabled={!row.fileUrl}
          >
            <FiDownload className="mr-1" /> {t('download')}
          </Button>
        </div>
      ),
      align: 'right',
    },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('salesReports')}</h1>
          <p className="text-gray-600">{t('salesReportsDescription')}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('totalRevenue')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {reportData ? formatCurrency(reportData.summary?.totalRevenue || 0) : '-'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('invoicesIssued')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {reportData ? reportData.summary?.totalInvoices || 0 : '-'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('averageOrderValue')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {reportData ? formatCurrency(reportData.summary?.averageOrderValue || 0) : '-'}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
              <CardTitle>{t('salesAnalysis')}</CardTitle>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={viewMode === 'chart' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('chart')}
                >
                  <FiBarChart2 className="mr-1" /> {t('chart')}
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <FiList className="mr-1" /> {t('table')}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('dateRange')}
                </label>
                <DateRangePicker
                  value={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onChange={setDateRange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('groupBy')}
                </label>
                <Select 
                  value={groupBy} 
                  onValueChange={(value) => setGroupBy(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectGrouping')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">{t('day')}</SelectItem>
                    <SelectItem value="week">{t('week')}</SelectItem>
                    <SelectItem value="month">{t('month')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button onClick={fetchReportData} className="w-full">
                  <FiRefreshCw className="mr-2" />
                  {t('updateReport')}
                </Button>
              </div>
            </div>
            
            {viewMode === 'chart' && (
              <div>
                <div className="mb-4 flex justify-center">
                  <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                      type="button"
                      onClick={() => setChartType('bar')}
                      className={`px-4 py-2 text-sm font-medium ${
                        chartType === 'bar'
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      } border border-gray-200 rounded-l-lg`}
                    >
                      <FiBarChart2 className="inline mr-1" /> {t('bar')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartType('line')}
                      className={`px-4 py-2 text-sm font-medium ${
                        chartType === 'line'
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      } border-t border-b border-gray-200`}
                    >
                      <FiShare2 className="inline mr-1" /> {t('line')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartType('pie')}
                      className={`px-4 py-2 text-sm font-medium ${
                        chartType === 'pie'
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      } border border-gray-200 rounded-r-lg`}
                    >
                      <FiPieChart className="inline mr-1" /> {t('pie')}
                    </button>
                  </div>
                </div>
                
                <div className="h-80">
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <Loading />
                    </div>
                  ) : reportData ? (
                    <>
                      {chartType === 'bar' && (
                        <BarChart 
                          data={reportData.data || []}
                          xKey="period"
                          yKeys={[{ key: "totalSales", name: t("revenue") }]}
                        />
                      )}
                      {chartType === 'line' && (
                        <LineChart 
                          data={reportData.data || []}
                          xKey="period"
                          yKeys={[{ key: "totalSales", name: t("revenue") }]}
                        />
                      )}
                      {chartType === 'pie' && (
                        <PieChart 
                          data={reportData.data?.map(item => ({
                            name: item.period,
                            value: item.totalSales
                          })) || []}
                        />
                      )}
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <FiBarChart2 size={48} />
                      <p className="mt-2">{t('noReportData')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {viewMode === 'table' && (
              <div>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <Loading />
                  </div>
                ) : reportData ? (
                  <DataTable
                    columns={salesColumns}
                    data={reportData.data || []}
                    pagination
                    initialPageSize={10}
                  />
                ) : (
                  <div className="h-80 flex flex-col items-center justify-center text-gray-500">
                    <FiGrid size={48} />
                    <p className="mt-2">{t('noReportData')}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-wrap justify-end gap-2">
            <div className="dropdown">
              <Button variant="outline">
                <FiDownload className="mr-2" />
                {t('download')}
              </Button>
              <div className="dropdown-menu shadow-md rounded-md bg-white p-2 mt-1">
                <button 
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                  onClick={() => generateReport(ReportFormat.PDF)}
                >
                  PDF
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                  onClick={() => generateReport(ReportFormat.EXCEL)}
                >
                  Excel
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                  onClick={() => generateReport(ReportFormat.CSV)}
                >
                  CSV
                </button>
              </div>
            </div>
            
            <Button>
              <FiSave className="mr-2" />
              {t('saveAsTemplate')}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Recent reports */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('recentReports')}</h2>
          
          <Card>
            <CardContent className="p-0">
              <DataTable
                columns={recentReportsColumns}
                data={recentReports}
                pagination
                initialPageSize={5}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
