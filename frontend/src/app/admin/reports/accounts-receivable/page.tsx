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
import { DataTable, Column } from "@/components/ui/Table/DataTable";

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
  const [reportData, setReportData] = useState<any>(null);
  
  // State for view mode
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('table');
  
  // State for chart type
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  
  // State for report view
  const [reportView, setReportView] = useState<'summary' | 'aging' | 'customer'>('summary');
  // Use the Report context
  const { 
    loading, 
    error: reportError,
    reportData,
    recentReports,
    fetchReportData: fetchContextReportData,
    fetchRecentReports,
    generateReport: generateContextReport,
    downloadReport,
    shareReport,
    optimizedChartData
  } = useReport();
  
  // Handle fetch report data
  const handleFetchReportData = async () => {
    const params: AccountsReceivableParams = {
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
      customerId,
      customerGroupId,
      agingPeriods,
      includeZeroBalance,
    };
    
    await fetchContextReportData(ReportType.ACCOUNTS_RECEIVABLE, params);
      
      setReportData(data);
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
  const fetchRecentReports = async () => {
    try {
      const { recentReports } = await reportService.getReportsSummary();
      setRecentReports(recentReports.filter(report => report.type === ReportType.ACCOUNTS_RECEIVABLE));
    } catch (error) {
      console.error("Failed to fetch recent reports:", error);
    }
  };
  
  // Generate report file
  const generateReport = async (format: ReportFormat) => {
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
    fetchCustomerData();
    fetchRecentReports();
  }, []);
  
  // Table columns for AR summary data
  const summaryColumns: Column<any>[] = [
    {
      key: 'date',
      header: t('date'),
      render: (row) => <span>{formatDate(row.date)}</span>,
      sortable: true,
    },
    {
      key: 'newInvoices',
      header: t('newInvoices'),
      render: (row) => <span>{formatCurrency(row.newInvoices)}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: 'payments',
      header: t('payments'),
      render: (row) => <span>{formatCurrency(row.payments)}</span>,
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
  ];
  
  // Table columns for AR aging data
  const agingColumns: Column<any>[] = [
    {
      key: 'customerName',
      header: t('customer'),
      render: (row) => <span>{row.customerName}</span>,
      sortable: true,
    },
    {
      key: 'current',
      header: t('current'),
      render: (row) => <span>{formatCurrency(row.current)}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: '30days',
      header: t('30days'),
      render: (row) => <span>{formatCurrency(row['30days'])}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: '60days',
      header: t('60days'),
      render: (row) => <span>{formatCurrency(row['60days'])}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: '90days',
      header: t('90days'),
      render: (row) => <span>{formatCurrency(row['90days'])}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: 'total',
      header: t('total'),
      render: (row) => <span className="font-bold">{formatCurrency(row.total)}</span>,
      sortable: true,
      align: 'right',
    },
  ];
  
  // Table columns for customer AR data
  const customerColumns: Column<any>[] = [
    {
      key: 'invoiceNumber',
      header: t('invoiceNumber'),
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
      key: 'paid',
      header: t('paid'),
      render: (row) => <span>{formatCurrency(row.paid)}</span>,
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
      key: 'status',
      header: t('status'),
      render: (row) => {
        let statusClass = '';
        if (row.status === 'Overdue') {
          statusClass = 'bg-red-100 text-red-800';
        } else if (row.status === 'Paid') {
          statusClass = 'bg-green-100 text-green-800';
        } else {
          statusClass = 'bg-blue-100 text-blue-800';
        }
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusClass}`}>
            {row.status}
          </span>
        );
      },
      sortable: true,
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('accountsReceivableReports')}</h1>
          <p className="text-gray-600">{t('accountsReceivableDescription')}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('totalReceivables')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {reportData ? formatCurrency(reportData.summary?.totalReceivables || 0) : '-'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('overdueAmount')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {reportData ? formatCurrency(reportData.summary?.overdueAmount || 0) : '-'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('customersWithBalance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {reportData ? reportData.summary?.customersWithBalance || 0 : '-'}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
              <CardTitle>{t('accountsReceivableAnalysis')}</CardTitle>
              
              <div className="flex flex-wrap gap-2">
                <Tabs value={reportView} onValueChange={(value) => setReportView(value as any)}>
                  <TabsList>
                    <TabsTrigger value="summary">
                      <FiDollarSign className="mr-1" />{t('summary')}
                    </TabsTrigger>
                    <TabsTrigger value="aging">
                      <FiClock className="mr-1" />{t('aging')}
                    </TabsTrigger>
                    <TabsTrigger value="customer">
                      <FiUsers className="mr-1" />{t('customer')}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              
              {reportView === 'customer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('customer')}
                  </label>
                  <Select 
                    value={customerId?.toString() || ""} 
                    onValueChange={(value) => setCustomerId(value ? parseInt(value) : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('allCustomers')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('allCustomers')}</SelectItem>
                      {customers.map(customer => (
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
                  value={customerGroupId?.toString() || ""} 
                  onValueChange={(value) => setCustomerGroupId(value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('allGroups')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('allGroups')}</SelectItem>
                    {customerGroups.map(group => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {reportView === 'aging' && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeZero" 
                    checked={includeZeroBalance}
                    onCheckedChange={(checked) => setIncludeZeroBalance(!!checked)}
                  />
                  <label
                    htmlFor="includeZero"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('includeZeroBalance')}
                  </label>
                </div>
              )}
              
              <div className="flex items-end md:col-span-3">
                <Button onClick={fetchReportData} className="w-full md:w-auto">
                  <FiRefreshCw className="mr-2" />
                  {t('updateReport')}
                </Button>
              </div>
            </div>
            
            {reportView === 'summary' && (
              <>
                <div className="flex justify-end mb-4">
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'table' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('table')}
                    >
                      <FiList className="mr-1" /> {t('table')}
                    </Button>
                    <Button
                      variant={viewMode === 'chart' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('chart')}
                    >
                      <FiBarChart2 className="mr-1" /> {t('chart')}
                    </Button>
                  </div>
                </div>
                
                {viewMode === 'chart' ? (
                  <div className="h-80">
                    {loading ? (
                      <div className="h-full flex items-center justify-center">
                        <Loading />
                      </div>
                    ) : reportData ? (
                      <LineChart 
                        data={reportData.data || []}
                        xKey="date"
                        yKeys={[
                          { key: "balance", name: t("balance") },
                          { key: "newInvoices", name: t("newInvoices") },
                          { key: "payments", name: t("payments") }
                        ]}
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <FiBarChart2 size={48} />
                        <p className="mt-2">{t('noReportData')}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {loading ? (
                      <div className="h-80 flex items-center justify-center">
                        <Loading />
                      </div>
                    ) : reportData ? (
                      <DataTable
                        columns={summaryColumns}
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
              </>
            )}
            
            {reportView === 'aging' && (
              <div>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <Loading />
                  </div>
                ) : reportData ? (
                  <>
                    <DataTable
                      columns={agingColumns}
                      data={reportData.aging || []}
                      pagination
                      initialPageSize={10}
                    />
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-bold mb-4">{t('agingAnalysis')}</h3>
                      <div className="h-60">
                        <BarChart 
                          data={[
                            { 
                              name: t('current'), 
                              value: reportData.agingSummary?.current || 0 
                            },
                            { 
                              name: t('30days'), 
                              value: reportData.agingSummary?.['30days'] || 0 
                            },
                            { 
                              name: t('60days'), 
                              value: reportData.agingSummary?.['60days'] || 0 
                            },
                            { 
                              name: t('90days'), 
                              value: reportData.agingSummary?.['90days'] || 0 
                            },
                          ]}
                          xKey="name"
                          yKeys={[{ key: "value", name: t("amount") }]}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-80 flex flex-col items-center justify-center text-gray-500">
                    <FiGrid size={48} />
                    <p className="mt-2">{t('noReportData')}</p>
                  </div>
                )}
              </div>
            )}
            
            {reportView === 'customer' && (
              <div>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <Loading />
                  </div>
                ) : reportData ? (
                  <DataTable
                    columns={customerColumns}
                    data={reportData.customerInvoices || []}
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
