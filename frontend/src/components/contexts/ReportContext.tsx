import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { reportService, Report, ReportType, ReportFormat } from '@/lib/api/services/report';
import useOptimizedChart from '@/lib/utils/useOptimizedChart';
import { createReportShareURL } from '@/lib/utils/report-sharing';

interface ReportContextProps {
  loading: boolean;
  error: string | null;
  reportData: any;
  recentReports: Report[];
  fetchReportData: (type: ReportType, parameters: any) => Promise<void>;
  fetchRecentReports: (type?: ReportType) => Promise<void>;
  generateReport: (reportData: Partial<Report>) => Promise<{success: boolean, id?: string, fileUrl?: string}>;
  downloadReport: (reportId: string, format: ReportFormat) => Promise<boolean>;
  shareReport: (reportId: string, options: any) => string;
  optimizedChartData: {
    timeSeries: (data: any[], maxPoints?: number) => any;
    categorical: (data: any[], maxCategories?: number) => any;
  };
}

const ReportContext = createContext<ReportContextProps | undefined>(undefined);

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [recentReports, setRecentReports] = useState<Report[]>([]);

  // Fetch report data from API
  const fetchReportData = async (type: ReportType, parameters: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await reportService.getReportData({
        type,
        parameters,
      });
      
      setReportData(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch report data';
      setError(errorMessage);
      console.error('Error fetching report data:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent reports
  const fetchRecentReports = async (type?: ReportType) => {
    setLoading(true);
    
    try {
      const { data } = await reportService.getReports({
        type,
        limit: 5,
        page: 1,
        sort: 'createdAt',
        sortDirection: 'desc',
      });
      
      setRecentReports(data);
      return data;
    } catch (err) {
      console.error('Error fetching recent reports:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Generate a report
  const generateReport = async (reportData: Partial<Report>) => {
    setLoading(true);
    setError(null);
    
    try {
      const createdReport = await reportService.createReport(reportData);
      
      if (createdReport && createdReport.id) {
        const result = await reportService.generateReport(createdReport.id);
        
        if (result && result.fileUrl) {
          // Refresh recent reports list
          fetchRecentReports(reportData.type);
          
          return {
            success: true,
            id: createdReport.id,
            fileUrl: result.fileUrl
          };
        }
      }
      
      setError('Failed to generate report');
      return { success: false };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate report';
      setError(errorMessage);
      console.error('Error generating report:', err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Download a report
  const downloadReport = async (reportId: string, format: ReportFormat) => {
    try {
      const blob = await reportService.downloadReport(reportId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (err) {
      console.error('Error downloading report:', err);
      return false;
    }
  };

  // Share a report
  const shareReport = (reportId: string, options: any) => {
    return createReportShareURL(reportId, options);
  };

  // Optimize chart data
  const optimizedChartData = useMemo(() => ({
    timeSeries: (data: any[], maxPoints = 100) => {
      const { optimizedData } = useOptimizedChart(data, {
        maxDataPoints: maxPoints,
        type: 'timeSeries'
      });
      return optimizedData;
    },
    
    categorical: (data: any[], maxCategories = 10) => {
      const { optimizedData } = useOptimizedChart(data, {
        type: 'categorical',
        maxCategories
      });
      return optimizedData;
    }
  }), []);

  const value = {
    loading,
    error,
    reportData,
    recentReports,
    fetchReportData,
    fetchRecentReports,
    generateReport,
    downloadReport,
    shareReport,
    optimizedChartData,
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => {
  const context = useContext(ReportContext);
  
  if (context === undefined) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  
  return context;
};

export default ReportContext;
