"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useReport } from "@/components/contexts/ReportContext";
import { 
  FiDownload, FiRefreshCw, FiFilter, FiAlertTriangle,
  FiBarChart2, FiPieChart, FiList, FiShare2, FiGrid,
  FiSave, FiPlus, FiChevronDown, FiBox, FiPackage
} from "react-icons/fi";
import { 
  ReportType, ReportFormat, ReportFrequency,
  Report, reportService, InventoryReportParams
} from "@/lib/api/services/report";
import { DatePicker } from "@/components/ui/DatePicker";
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

// Import services for warehouses, products and categories
import { warehouseService } from "@/lib/api/services/warehouse";
import { productService } from "@/lib/api/services/product";

// Chart components
import { BarChart, LineChart, PieChart } from "@/components/ui/charts";
import { DataTable, Column } from "@/components/ui/Table/DataTable";

export default function InventoryReportsPage() {
  const t = useTranslations("admin.reports");
  
  // State for date filter
  const [asOfDate, setAsOfDate] = useState<Date>(new Date());
  
  // State for warehouse filter
  const [warehouseId, setWarehouseId] = useState<number | undefined>(undefined);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  
  // State for product category filter
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [categories, setCategories] = useState<any[]>([]);
  
  // State for options
  const [belowThreshold, setBelowThreshold] = useState<boolean>(false);
  
  // State for report data
  const [reportData, setReportData] = useState<any>(null);
  
  // State for view mode
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('table');
  
  // State for chart type
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  
  // State for report view
  const [reportView, setReportView] = useState<'current' | 'movement'>('current');
    // State for movement date range
  const [movementDateRange, setMovementDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  // Get report context
  const { 
    loading, 
    error: reportError,
    reportData: contextReportData,
    recentReports,
    fetchReportData,
    fetchRecentReports,
    generateReport,
    downloadReport,
    shareReport,
    optimizedChartData
  } = useReport();
  
  // Fetch warehouses and categories
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Fetch warehouses
        const warehouseResponse = await warehouseService.getWarehouses();
        setWarehouses(warehouseResponse.data);
        
        // Fetch product categories
        const categoriesResponse = await productService.getProductCategories();
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      }
    };
    
    fetchFilters();
    handleFetchReportData();
    fetchRecentReports();
  }, []);
  
  // Custom implementation to fetch report data with specific parameters
  const handleFetchReportData = async () => {
    setLoading(true);
    try {
      const params: InventoryReportParams = {
        warehouseId,
        categoryId,
        belowThreshold,
        asOfDate: asOfDate.toISOString(),
      };
      
      if (reportView === 'movement') {
        params.includeMovement = true;
        params.movementStartDate = movementDateRange.from.toISOString();
        params.movementEndDate = movementDateRange.to.toISOString();
      }
      
      const data = await reportService.getReportData({
        type: ReportType.INVENTORY,
        parameters: params,
      });
      
      setReportData(data);
    } catch (error) {
      console.error("Failed to fetch report data:", error);
    } finally {
      setLoading(false);
    }
  };
    // Fetch recent inventory reports - renamed to avoid conflict with context function
  const fetchLocalRecentReports = async () => {
    try {
      const { recentReports } = await reportService.getReportsSummary();
      setRecentReports(recentReports.filter(report => report.type === ReportType.INVENTORY));
    } catch (error) {
      console.error("Failed to fetch recent reports:", error);
    }
  };
    // Generate report file - renamed to avoid conflict with context function
  const generateLocalReport = async (format: ReportFormat) => {
    try {
      const params: InventoryReportParams = {
        warehouseId,
        categoryId,
        belowThreshold,
        asOfDate: asOfDate.toISOString(),
      };
      
      if (reportView === 'movement') {
        params.includeMovement = true;
        params.movementStartDate = movementDateRange.from.toISOString();
        params.movementEndDate = movementDateRange.to.toISOString();
      }
      
      const reportData = {
        name: `Inventory Report - ${formatDate(asOfDate)}`,
        description: `Inventory report ${warehouseId ? `for warehouse ID ${warehouseId}` : 'across all warehouses'}${belowThreshold ? ' - Below Threshold Items Only' : ''}`,
        type: ReportType.INVENTORY,
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
        link.download = `inventory_report_${new Date().getTime()}.${format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();        document.body.removeChild(link);
        
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
  
  // Table columns for inventory data
  const inventoryColumns: Column<any>[] = [
    {
      key: 'productCode',
      header: t('productCode'),
      render: (row) => <span>{row.productCode}</span>,
      sortable: true,
    },
    {
      key: 'productName',
      header: t('productName'),
      render: (row) => <span>{row.productName}</span>,
      sortable: true,
    },
    {
      key: 'category',
      header: t('category'),
      render: (row) => <span>{row.category}</span>,
      sortable: true,
    },
    {
      key: 'warehouse',
      header: t('warehouse'),
      render: (row) => <span>{row.warehouse}</span>,
      sortable: true,
    },
    {
      key: 'quantity',
      header: t('quantity'),
      render: (row) => (
        <div className="flex items-center justify-end">
          {row.belowThreshold && (
            <FiAlertTriangle className="text-amber-500 mr-1" />
          )}
          <span>{row.quantity}</span>
        </div>
      ),
      sortable: true,
      align: 'right',
    },
    {
      key: 'value',
      header: t('value'),
      render: (row) => <span>{formatCurrency(row.value)}</span>,
      sortable: true,
      align: 'right',
    },
  ];
  
  // Table columns for inventory movement data
  const movementColumns: Column<any>[] = [
    {
      key: 'productCode',
      header: t('productCode'),
      render: (row) => <span>{row.productCode}</span>,
      sortable: true,
    },
    {
      key: 'productName',
      header: t('productName'),
      render: (row) => <span>{row.productName}</span>,
      sortable: true,
    },
    {
      key: 'startQuantity',
      header: t('startQuantity'),
      render: (row) => <span>{row.startQuantity}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: 'received',
      header: t('received'),
      render: (row) => <span className="text-green-600">{row.received > 0 ? `+${row.received}` : row.received}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: 'shipped',
      header: t('shipped'),
      render: (row) => <span className="text-red-600">{row.shipped < 0 ? row.shipped : `-${row.shipped}`}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: 'adjustments',
      header: t('adjustments'),
      render: (row) => {
        const textClass = row.adjustments > 0 ? 'text-green-600' : row.adjustments < 0 ? 'text-red-600' : '';
        return <span className={textClass}>{row.adjustments > 0 ? `+${row.adjustments}` : row.adjustments}</span>;
      },
      sortable: true,
      align: 'right',
    },
    {
      key: 'endQuantity',
      header: t('endQuantity'),
      render: (row) => <span>{row.endQuantity}</span>,
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('inventoryReports')}</h1>
          <p className="text-gray-600">{t('inventoryReportsDescription')}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('totalProducts')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {reportData ? reportData.summary?.totalProducts || 0 : '-'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('totalValue')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {reportData ? formatCurrency(reportData.summary?.totalValue || 0) : '-'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('lowStockItems')}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <div className="text-3xl font-bold">
                {reportData ? reportData.summary?.lowStockItems || 0 : '-'}
              </div>
              {reportData && reportData.summary?.lowStockItems > 0 && (
                <FiAlertTriangle className="ml-2 text-amber-500 text-xl" />
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
              <CardTitle>{t('inventoryAnalysis')}</CardTitle>
              
              <div className="flex flex-wrap gap-2">
                <Tabs value={reportView} onValueChange={(value) => setReportView(value as any)}>
                  <TabsList>
                    <TabsTrigger value="current">
                      <FiBox className="mr-1" />{t('currentStock')}
                    </TabsTrigger>
                    <TabsTrigger value="movement">
                      <FiPackage className="mr-1" />{t('stockMovement')}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportView === 'current' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('asOfDate')}
                    </label>
                    <DatePicker
                      value={asOfDate}
                      onChange={setAsOfDate}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('warehouse')}
                    </label>
                    <Select 
                      value={warehouseId?.toString() || ""} 
                      onValueChange={(value) => setWarehouseId(value ? parseInt(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('allWarehouses')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t('allWarehouses')}</SelectItem>
                        {warehouses.map(warehouse => (
                          <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                            {warehouse.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('productCategory')}
                    </label>
                    <Select 
                      value={categoryId?.toString() || ""} 
                      onValueChange={(value) => setCategoryId(value ? parseInt(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('allCategories')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t('allCategories')}</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end space-x-2">
                    <div className="flex items-center h-10 space-x-2">
                      <Checkbox 
                        id="belowThreshold" 
                        checked={belowThreshold}
                        onCheckedChange={(checked) => setBelowThreshold(!!checked)}
                      />
                      <label
                        htmlFor="belowThreshold"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t('belowThresholdOnly')}
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('dateRange')}
                    </label>
                    <div className="flex space-x-2">
                      <DatePicker
                        value={movementDateRange.from}
                        onChange={(date) => setMovementDateRange({ ...movementDateRange, from: date })}
                        placeholder={t('from')}
                      />
                      <DatePicker
                        value={movementDateRange.to}
                        onChange={(date) => setMovementDateRange({ ...movementDateRange, to: date })}
                        placeholder={t('to')}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('warehouse')}
                    </label>
                    <Select 
                      value={warehouseId?.toString() || ""} 
                      onValueChange={(value) => setWarehouseId(value ? parseInt(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('allWarehouses')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t('allWarehouses')}</SelectItem>
                        {warehouses.map(warehouse => (
                          <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                            {warehouse.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('productCategory')}
                    </label>
                    <Select 
                      value={categoryId?.toString() || ""} 
                      onValueChange={(value) => setCategoryId(value ? parseInt(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('allCategories')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t('allCategories')}</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
                <div className="flex items-end md:col-span-4">
                <Button onClick={handleFetchReportData} className="w-full md:w-auto">
                  <FiRefreshCw className="mr-2" />
                  {t('updateReport')}
                </Button>
              </div>
            </div>
            
            {reportView === 'current' && (
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
            )}
            
            {reportView === 'current' && viewMode === 'chart' && (
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
                          data={reportData.data?.slice(0, 15) || []}
                          xKey="productName"
                          yKeys={[{ key: "quantity", name: t("quantity") }]}
                        />
                      )}
                      {chartType === 'pie' && (
                        <PieChart 
                          data={(reportData.data || [])
                            .filter((_: any, i: number) => i < 10)
                            .map((item: any) => ({
                              name: item.productName,
                              value: item.value
                            }))
                          }
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
            
            {(reportView === 'current' && viewMode === 'table') && (
              <div>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <Loading />
                  </div>
                ) : reportData ? (
                  <DataTable
                    columns={inventoryColumns}
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
            
            {reportView === 'movement' && (
              <div>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <Loading />
                  </div>
                ) : reportData ? (
                  <DataTable
                    columns={movementColumns}
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
