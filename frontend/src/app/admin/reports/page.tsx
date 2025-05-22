"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AdminLayout from "@/components/layouts/AdminLayout";
import { 
  FiBarChart2, FiBox, FiDollarSign, FiFileText, 
  FiPlusSquare, FiClock, FiDownload, FiSettings, 
  FiUsers, FiTruck, FiShoppingCart, FiPieChart 
} from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { 
  ReportType, Report, reportService
} from "@/lib/api/services/report";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { formatDateTime, formatDate, formatCurrency } from "@/lib/utils/format";

export default function ReportsPage() {
  const t = useTranslations("admin.reports");
  
  // State for recent reports and statistics
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [reportStats, setReportStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch reports data
  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const data = await reportService.getReportsSummary();
      setRecentReports(data.recentReports);
      setReportStats(data.reportCounts);
    } catch (error) {
      console.error("Failed to fetch reports data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReportsData();
  }, []);
  
  // Report category cards
  const reportCategories = [
    {
      title: t('salesReports'),
      description: t('salesReportsDescription'),
      icon: <FiDollarSign size={24} className="text-green-500" />,
      href: '/admin/reports/sales',
      stats: reportStats ? reportStats[ReportType.SALES] : 0
    },
    {
      title: t('inventoryReports'),
      description: t('inventoryReportsDescription'),
      icon: <FiBox size={24} className="text-blue-500" />,
      href: '/admin/reports/inventory',
      stats: reportStats ? reportStats[ReportType.INVENTORY] : 0
    },
    {
      title: t('accountsReceivableReports'),
      description: t('accountsReceivableDescription'),
      icon: <FiFileText size={24} className="text-amber-500" />,
      href: '/admin/reports/accounts-receivable',
      stats: reportStats ? reportStats[ReportType.ACCOUNTS_RECEIVABLE] : 0
    },
    {
      title: t('customReports'),
      description: t('customReportsDescription'),
      icon: <FiPieChart size={24} className="text-purple-500" />,
      href: '/admin/reports/custom',
      stats: reportStats ? reportStats[ReportType.CUSTOM] : 0
    }
  ];
  
  // Function to download report
  const downloadReport = async (id: string) => {
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

  return (
    <AdminLayout>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('reportsAndAnalytics')}</h1>
          <p className="text-gray-600">{t('reportsAndAnalyticsDescription')}</p>
        </div>
        
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {reportCategories.map((category, index) => (
                <Link href={category.href} key={index}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        {category.icon}
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium rounded-full px-2.5 py-1">
                          {category.stats} {t('reports')}
                        </span>
                      </div>
                      <CardTitle>{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end pt-0">
                      <Button variant="ghost" size="sm">
                        {t('viewReports')}
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>{t('recentReports')}</CardTitle>
                      <Button variant="outline" size="sm">
                        <FiSettings className="mr-2" />
                        {t('manageAll')}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {recentReports.length > 0 ? (
                        recentReports.slice(0, 5).map((report) => (
                          <div key={report.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div>
                              <h3 className="font-medium text-gray-900">{report.name}</h3>
                              <div className="flex items-center mt-1">
                                <span className="text-xs text-gray-500 mr-2">
                                  {formatDateTime(report.createdAt)}
                                </span>
                                <span className={`uppercase text-xs px-2 py-1 rounded ${
                                  report.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : report.status === 'processing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : report.status === 'failed'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {report.status}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              {report.status === 'completed' && report.fileUrl && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => downloadReport(report.id)}
                                >
                                  <FiDownload />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FiFileText className="mx-auto mb-3" size={32} />
                          <p>{t('noReports')}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{t('quickActions')}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <Link href="/admin/reports/sales">
                        <Button variant="outline" className="w-full justify-start">
                          <FiBarChart2 className="mr-2" /> {t('generateSalesReport')}
                        </Button>
                      </Link>
                      
                      <Link href="/admin/reports/inventory">
                        <Button variant="outline" className="w-full justify-start">
                          <FiBox className="mr-2" /> {t('checkInventoryLevels')}
                        </Button>
                      </Link>
                      
                      <Link href="/admin/reports/accounts-receivable">
                        <Button variant="outline" className="w-full justify-start">
                          <FiDollarSign className="mr-2" /> {t('reviewAccountsReceivable')}
                        </Button>
                      </Link>
                      
                      <Link href="/admin/reports/custom">
                        <Button variant="outline" className="w-full justify-start">
                          <FiPlusSquare className="mr-2" /> {t('createCustomReport')}
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="font-medium text-sm mb-3">{t('scheduledReports')}</h3>
                      <div className="text-sm">
                        <div className="flex justify-between items-center py-2">
                          <div className="flex items-center">
                            <FiClock className="text-blue-500 mr-2" />
                            <span>{t('dailySalesReport')}</span>
                          </div>
                          <span className="text-xs text-gray-500">08:00 AM</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <div className="flex items-center">
                            <FiClock className="text-green-500 mr-2" />
                            <span>{t('weeklyInventory')}</span>
                          </div>
                          <span className="text-xs text-gray-500">{t('monday')} 9:00 AM</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>{t('reportingTools')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <FiUsers className="mx-auto mb-2 text-blue-500" size={24} />
                      <h3 className="font-medium">{t('customerAnalytics')}</h3>
                      <p className="text-sm text-gray-600 mt-1">{t('understandCustomerBehavior')}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <FiTruck className="mx-auto mb-2 text-green-500" size={24} />
                      <h3 className="font-medium">{t('supplierAnalytics')}</h3>
                      <p className="text-sm text-gray-600 mt-1">{t('trackSupplierPerformance')}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <FiShoppingCart className="mx-auto mb-2 text-amber-500" size={24} />
                      <h3 className="font-medium">{t('salesTrends')}</h3>
                      <p className="text-sm text-gray-600 mt-1">{t('identifyTrends')}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <FiPieChart className="mx-auto mb-2 text-purple-500" size={24} />
                      <h3 className="font-medium">{t('financialInsights')}</h3>
                      <p className="text-sm text-gray-600 mt-1">{t('trackFinancialMetrics')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('documentation')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium flex items-center">
                        <FiFileText className="mr-2 text-blue-500" />
                        {t('reportingGuide')}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{t('reportingGuideDesc')}</p>
                      <Button variant="link" className="p-0 mt-2 h-auto">
                        {t('readMore')}
                      </Button>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium flex items-center">
                        <FiFileText className="mr-2 text-green-500" />
                        {t('customReportTutorial')}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{t('customReportTutorialDesc')}</p>
                      <Button variant="link" className="p-0 mt-2 h-auto">
                        {t('readMore')}
                      </Button>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium flex items-center">
                        <FiFileText className="mr-2 text-amber-500" />
                        {t('dataExportOptions')}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{t('dataExportOptionsDesc')}</p>
                      <Button variant="link" className="p-0 mt-2 h-auto">
                        {t('readMore')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
