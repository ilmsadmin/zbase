import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SalesReportsPage from '@/app/[locale]/admin/reports/sales/page';
import { reportService } from '@/lib/api/services/report';

// Mock the next-intl hooks
jest.mock('next-intl', () => ({
  useTranslations: () => (key) => key
}));

// Mock the chart components
jest.mock('@/components/ui/charts', () => ({
  BarChart: ({ data }) => <div data-testid="bar-chart">{JSON.stringify(data)}</div>,
  LineChart: ({ data }) => <div data-testid="line-chart">{JSON.stringify(data)}</div>,
  PieChart: ({ data }) => <div data-testid="pie-chart">{JSON.stringify(data)}</div>,
}));

// Mock the DateRangePicker component
jest.mock('@/components/ui/DateRangePicker', () => ({
  DateRangePicker: ({ value, onChange }) => (
    <div data-testid="date-range-picker">
      <button onClick={() => onChange({ from: new Date('2025-04-01'), to: new Date('2025-04-30') })}>
        Select Date Range
      </button>
    </div>
  )
}));

// Mock the report service
jest.mock('@/lib/api/services/report', () => {
  const actual = jest.requireActual('@/lib/api/services/report');
  return {
    ...actual,
    reportService: {
      getReportData: jest.fn(),
      getReports: jest.fn(),
      createReport: jest.fn(),
      generateReport: jest.fn(),
      downloadReport: jest.fn(),
    }
  };
});

// Mock the DataTable component
jest.mock('@/components/ui/Table/DataTable', () => ({
  DataTable: ({ data, columns }) => (
    <div data-testid="data-table">
      <span>Rows: {data.length}</span>
    </div>
  ),
  Column: ({ key, header }) => <div>{key}: {header}</div>
}));

describe('SalesReportsPage', () => {
  const mockSalesData = {
    summary: {
      totalSales: 125000,
      totalOrders: 1500,
      avgOrderValue: 83.33,
      totalProducts: 250,
      topSellingProduct: 'Product XYZ',
      topSellingCategory: 'Electronics'
    },
    chartData: {
      salesByDay: [
        { date: '2025-04-01', revenue: 3500 },
        { date: '2025-04-02', revenue: 4200 },
        { date: '2025-04-03', revenue: 3800 }
      ],
      salesByProduct: [
        { name: 'Product A', revenue: 12500 },
        { name: 'Product B', revenue: 10800 },
        { name: 'Product C', revenue: 9500 }
      ],
      salesByCategory: [
        { name: 'Electronics', revenue: 45000 },
        { name: 'Furniture', revenue: 32000 },
        { name: 'Clothing', revenue: 28000 }
      ]
    },
    tableData: [
      {
        id: 1,
        date: '2025-04-01',
        orderNumber: 'ORD-001',
        customer: 'Customer 1',
        amount: 350,
        status: 'completed'
      },
      {
        id: 2,
        date: '2025-04-02',
        orderNumber: 'ORD-002',
        customer: 'Customer 2',
        amount: 420,
        status: 'completed'
      }
    ]
  };

  const mockReports = {
    data: [
      {
        id: '1',
        name: 'Monthly Sales Report - Apr 2025',
        type: 'sales',
        format: 'pdf',
        status: 'completed',
        createdAt: '2025-05-01T10:00:00Z',
        lastGeneratedAt: '2025-05-01T10:05:00Z'
      }
    ],
    total: 1,
    page: 1,
    limit: 10
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the report service responses
    (reportService.getReportData as jest.Mock).mockResolvedValue(mockSalesData);
    (reportService.getReports as jest.Mock).mockResolvedValue(mockReports);
    (reportService.createReport as jest.Mock).mockResolvedValue({ id: '2' });
    (reportService.generateReport as jest.Mock).mockResolvedValue({ fileUrl: '/reports/sales-report-2.pdf' });
    (reportService.downloadReport as jest.Mock).mockResolvedValue(new Blob(['test content']));
  });

  it('should render the sales reports page with summary cards', async () => {
    render(<SalesReportsPage />);

    await waitFor(() => {
      expect(reportService.getReportData).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('admin.reports.salesOverview')).toBeInTheDocument();
      expect(screen.getByText('admin.reports.totalSales')).toBeInTheDocument();
      expect(screen.getByText('admin.reports.totalOrders')).toBeInTheDocument();
      expect(screen.getByText('admin.reports.avgOrderValue')).toBeInTheDocument();
    });
  });

  it('should display charts for sales data visualization', async () => {
    render(<SalesReportsPage />);

    await waitFor(() => {
      // Check that charts are rendered
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });
  });

  it('should update data when date range changes', async () => {
    render(<SalesReportsPage />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(reportService.getReportData).toHaveBeenCalled();
    });
    
    // Clear previous calls count
    (reportService.getReportData as jest.Mock).mockClear();
    
    // Change date range
    const dateRangePicker = screen.getByTestId('date-range-picker');
    const changeDateButton = screen.getByText('Select Date Range');
    userEvent.click(changeDateButton);
    
    // Check that data was fetched again with new date range
    await waitFor(() => {
      expect(reportService.getReportData).toHaveBeenCalledWith(
        expect.objectContaining({
          parameters: expect.objectContaining({
            startDate: expect.any(String),
            endDate: expect.any(String)
          })
        })
      );
    });
  });

  it('should handle report generation', async () => {
    render(<SalesReportsPage />);
    
    await waitFor(() => {
      expect(reportService.getReportData).toHaveBeenCalled();
    });
    
    // Find and click the generate report button
    const generateButton = screen.getByText('admin.reports.generateReport');
    userEvent.click(generateButton);
    
    // Check that the report creation and generation were called
    await waitFor(() => {
      expect(reportService.createReport).toHaveBeenCalled();
      expect(reportService.generateReport).toHaveBeenCalled();
    });
  });

  it('should display previous reports', async () => {
    render(<SalesReportsPage />);
    
    await waitFor(() => {
      expect(reportService.getReports).toHaveBeenCalled();
    });
    
    // Check that previous reports are listed
    await waitFor(() => {
      expect(screen.getByText('Monthly Sales Report - Apr 2025')).toBeInTheDocument();
    });
  });
});
