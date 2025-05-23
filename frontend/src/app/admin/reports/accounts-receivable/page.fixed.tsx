"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useReport } from "@/components/contexts/ReportContext";
import { 
  FiDownload, FiRefreshCw, FiFilter, FiAlertTriangle,
  FiBarChart2, FiPieChart, FiList, FiShare2, FiGrid,
  FiSave, FiDollarSign, FiUsers, FiClock, FiChevronDown
} from "react-icons/fi";
import { 
  ReportType, ReportFormat, ReportFrequency,
  Report, reportService, AccountsReceivableParams
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
import { Checkbox } from "@/components/ui/Checkbox";
import { Loading } from "@/components/ui/Loading";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils/format";

// Chart components
import { BarChart, LineChart, PieChart } from "@/components/ui/charts";
import DataTable, { Column } from "@/components/ui/Table/DataTable";

export default function AccountsReceivableReportsPage() {
  const t = useTranslations("admin.reports");
  
  // State for date range
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  // State for customer filter
  const [customerId, setCustomerId] = useState<number | undefined>(undefined);
  const [customers, setCustomers] = useState<any[]>([]);
  
  // State for customer group filter
  const [customerGroupId, setCustomerGroupId] = useState<number | undefined>(undefined);
  const [customerGroups, setCustomerGroups] = useState<any[]>([]);
  
  // State for aging periods
  const [agingPeriods, setAgingPeriods] = useState<number[]>([30, 60, 90]);
  
  // State for include zero balance
  const [includeZeroBalance, setIncludeZeroBalance] = useState<boolean>(false);
  
  // State for report data
  const [localReportData, setLocalReportData] = useState<any>(null);
  
  // State for view mode
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('table');
  
  // State for chart type
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  
  // State for report view
  const [reportView, setReportView] = useState<'summary' | 'aging' | 'customer'>('summary');
  
  // State for loading
  const [loading, setLoading] = useState<boolean>(false);
  
  // State for local recent reports
  const [localRecentReports, setLocalRecentReports] = useState<Report[]>([]);
  
  // Use the Report context
  const { 
    loading: contextLoading, 
    error: reportError,
    reportData: contextReportData,
    recentReports: contextRecentReports,
    fetchReportData: fetchContextReportData,
    fetchRecentReports: fetchContextRecentReports,
    generateReport: generateContextReport,
    downloadReport: contextDownloadReport,
    shareReport: contextShareReport,
    optimizedChartData
  } = useReport();
  
  // Handle fetch report data
  const fetchReportData = async () => {
    setLoading(true);
    try {
      const params: AccountsReceivableParams = {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        customerId,
        customerGroupId,
        agingPeriods,
        includeZeroBalance,
      };
      
      const data = await reportService.getReportData({
        type: ReportType.ACCOUNTS_RECEIVABLE,
        parameters: params,
      });
      
      setLocalReportData(data);
    } catch (error) {
      console.error("Failed to fetch report data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch customer data
  const fetchCustomerData = async () => {
    try {
      // Note: This would need to be implemented with actual customer service
      // For now using mock data
      setCustomers([
        { id: 1, name: 'Acme Inc.' },
        { id: 2, name: 'TechCorp Ltd.' },
        { id: 3, name: 'Local Business' },
      ]);
      
      setCustomerGroups([
        { id: 1, name: 'Corporate' },
        { id: 2, name: 'Small Business' },
        { id: 3, name: 'Individual' },
      ]);
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
    }
  };
  
  // Fetch recent reports
  const fetchLocalRecentReports = async () => {
    try {
      const { recentReports } = await reportService.getReportsSummary();
      setLocalRecentReports(recentReports.filter(report => report.type === ReportType.ACCOUNTS_RECEIVABLE));
    } catch (error) {
      console.error("Failed to fetch recent reports:", error);
    }
  };
  
  // Generate report file
  const generateLocalReport = async (format: ReportFormat) => {
    try {
      const params: AccountsReceivableParams = {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        customerId,
        customerGroupId,
        agingPeriods,
        includeZeroBalance,
      };
      
      const reportData = {
        name: `Accounts Receivable Report - ${formatDate(dateRange.from)} to ${formatDate(dateRange.to)}`,
        description: `Accounts receivable report${customerId ? ` for customer ID ${customerId}` : ''}${customerGroupId ? ` for customer group ID ${customerGroupId}` : ''}`,
        type: ReportType.ACCOUNTS_RECEIVABLE,
        format: format,
        parameters: params,
        frequency: ReportFrequency.ONCE,
      };
      
      const result = await reportService.createReport(reportData);
      
      if (result && result.id) {
        const { fileUrl } = await reportService.generateReport(result.id);
        
        // Create download link
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = `ar_report_${new Date().getTime()}.${format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Refresh recent reports
        fetchLocalRecentReports();
      }
    } catch (error) {
      console.error("Failed to generate report:", error);
    }
  };
  
  // Download existing report
  const downloadExistingReport = async (id: string) => {
    try {
      const blob = await reportService.downloadReport(id);
      const report = localRecentReports.find((r: Report) => r.id === id);
      
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
  
  // Initialize data
  useEffect(() => {
    fetchReportData();
    fetchCustomerData();
    fetchLocalRecentReports();
  }, []);

  // Columns for aging table
  const agingColumns: Column<any>[] = [
    {
      key: 'customer',
      header: t('customer'),
      render: (row) => <span>{row.customerName}</span>,
      sortable: true,
    },
    {
      key: 'total',
      header: t('totalReceivable'),
      render: (row) => <span>{formatCurrency(row.total)}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: 'current',
      header: t('current'),
      render: (row) => <span>{formatCurrency(row.current)}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: '1-30',
      header: t('days', { days: '1-30' }),
      render: (row) => <span>{formatCurrency(row.period1)}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: '31-60',
      header: t('days', { days: '31-60' }),
      render: (row) => <span>{formatCurrency(row.period2)}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: '61-90',
      header: t('days', { days: '61-90' }),
      render: (row) => <span>{formatCurrency(row.period3)}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: '91+',
      header: t('days', { days: '91+' }),
      render: (row) => <span>{formatCurrency(row.period4)}</span>,
      sortable: true,
      align: 'right',
    },
  ];
  
  // Columns for customer table
  const customerColumns: Column<any>[] = [
    {
      key: 'invoice',
      header: t('invoice'),
      render: (row) => <span>{row.invoiceNumber}</span>,
      sortable: true,
    },
    {
      key: 'date',
      header: t('date'),
      render: (row) => <span>{formatDate(row.date)}</span>,
      sortable: true,
    },
    {
      key: 'dueDate',
      header: t('dueDate'),
      render: (row) => <span>{formatDate(row.dueDate)}</span>,
      sortable: true,
    },
    {
      key: 'amount',
      header: t('amount'),
      render: (row) => <span>{formatCurrency(row.amount)}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: 'balance',
      header: t('balance'),
      render: (row) => <span>{formatCurrency(row.balance)}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: 'daysOverdue',
      header: t('daysOverdue'),
      render: (row) => <span>{row.daysOverdue}</span>,
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('accountsReceivable')}</h1>
          <p className="text-gray-600">{t('accountsReceivableDescription')}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('totalReceivable')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {localReportData ? formatCurrency(localReportData.summary?.totalReceivable || 0) : '-'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('totalOverdue')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {localReportData ? formatCurrency(localReportData.summary?.totalOverdue || 0) : '-'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('averageDaysToPay')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {localReportData ? localReportData.summary?.averageDaysToPay.toFixed(1) || '-' : '-'}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
              <CardTitle>{t('accountsReceivableAnalysis')}</CardTitle>
              
              <div className="flex flex-wrap gap-2">
                <Tabs value={reportView} onValueChange={(value) => setReportView(value as any)} className="mr-4">
                  <TabsList>
                    <TabsTrigger value="summary">{t('summary')}</TabsTrigger>
                    <TabsTrigger value="aging">{t('aging')}</TabsTrigger>
                    <TabsTrigger value="customer">{t('customerDetail')}</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex">
                  <Button
                    variant={viewMode === 'chart' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('chart')}
                    className="rounded-r-none"
                    disabled={reportView === 'customer'}
                  >
                    <FiBarChart2 className="mr-1" /> {t('chart')}
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="rounded-l-none"
                  >
                    <FiList className="mr-1" /> {t('table')}
                  </Button>
                </div>
                
                {viewMode === 'chart' && (
                  <div className="flex">
                    <Button
                      variant={chartType === 'bar' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartType('bar')}
                      className="rounded-r-none"
                    >
                      <FiBarChart2 className="mr-1" /> {t('bar')}
                    </Button>
                    <Button
                      variant={chartType === 'pie' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartType('pie')}
                      className="rounded-l-none"
                    >
                      <FiPieChart className="mr-1" /> {t('pie')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('dateRange')}
                </label>
                <DateRangePicker
                  value={{
                    from: dateRange.from,
                    to: dateRange.to
                  }}
                  onChange={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({
                        from: range.from,
                        to: range.to
                      });
                    }
                  }}
                />
              </div>
              
              {reportView === 'customer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('customer')}
                  </label>
                  <Select
                    value={customerId?.toString() || ''}
                    onValueChange={(value) => setCustomerId(value ? parseInt(value) : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectCustomer')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('allCustomers')}</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('customerGroup')}
                </label>
                <Select
                  value={customerGroupId?.toString() || ''}
                  onValueChange={(value) => setCustomerGroupId(value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCustomerGroup')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('allCustomerGroups')}</SelectItem>
                    {customerGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-zero-balance"
                  checked={includeZeroBalance}
                  onCheckedChange={(checked) => setIncludeZeroBalance(!!checked)}
                />
                <label
                  htmlFor="include-zero-balance"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('includeZeroBalance')}
                </label>
              </div>
              
              <div className="flex items-end md:col-span-3">
                <Button onClick={fetchReportData} className="w-full">
                  <FiRefreshCw className="mr-2" />
                  {t('updateReport')}
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="h-80 flex items-center justify-center">
                <Loading />
              </div>
            ) : localReportData ? (
              <>
                {reportView === 'summary' && (
                  <>
                    {viewMode === 'chart' ? (
                      <div className="h-80">
                        {chartType === 'bar' && (
                          <BarChart 
                            title={t('receivablesOverTime')}
                            labels={localReportData.trends.map((item: any) => item.period)}
                            datasets={[
                              {
                                label: t('totalReceivable'),
                                data: localReportData.trends.map((item: any) => item.totalReceivable)
                              },
                              {
                                label: t('overdue'),
                                data: localReportData.trends.map((item: any) => item.overdue)
                              }
                            ]}
                          />
                        )}
                        {chartType === 'pie' && (
                          <PieChart 
                            title={t('receivablesByAge')}
                            labels={[t('current'), ...agingPeriods.map((period) => t('days', { days: `${period}` })), t('days', { days: '90+' })]}
                            data={[
                              localReportData.summary.current || 0,
                              localReportData.summary.period1 || 0,
                              localReportData.summary.period2 || 0,
                              localReportData.summary.period3 || 0,
                              localReportData.summary.period4 || 0
                            ]}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="overflow-hidden">
                        <DataTable
                          columns={agingColumns}
                          data={localReportData.customers || []}
                          pagination
                          initialPageSize={10}
                        />
                      </div>
                    )}
                  </>
                )}
                
                {reportView === 'aging' && (
                  <div className="overflow-hidden">
                    <DataTable
                      columns={agingColumns}
                      data={localReportData.customers || []}
                      pagination
                      initialPageSize={10}
                    />
                  </div>
                )}
                
                {reportView === 'customer' && (
                  <div className="overflow-hidden">
                    <DataTable
                      columns={customerColumns}
                      data={localReportData.invoices || []}
                      pagination
                      initialPageSize={10}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center text-gray-500">
                <FiDollarSign size={48} />
                <p className="mt-2">{t('noReportData')}</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-wrap justify-end gap-2">
            <div className="dropdown">
              <Button variant="outline">
                <FiDownload className="mr-2" />
                {t('download')}
                <FiChevronDown className="ml-2" />
              </Button>
              <div className="dropdown-menu shadow-md rounded-md bg-white p-2 mt-1">
                <button 
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                  onClick={() => generateLocalReport(ReportFormat.PDF)}
                >
                  PDF
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                  onClick={() => generateLocalReport(ReportFormat.EXCEL)}
                >
                  Excel
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                  onClick={() => generateLocalReport(ReportFormat.CSV)}
                >
                  CSV
                </button>
              </div>
            </div>
            
            <Button>
              <FiShare2 className="mr-2" />
              {t('share')}
            </Button>
            
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
                data={localRecentReports}
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
