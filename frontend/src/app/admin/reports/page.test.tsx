import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReportsPage from '@/app/[locale]/admin/reports/page';
import { reportService, ReportType, ReportFormat, ReportStatus, ReportFrequency } from '@/lib/api/services/report';

// Mock the next-intl hooks
jest.mock('next-intl', () => ({
  useTranslations: () => (key) => key
}));

// Mock the i18n navigation
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, ...props }) => <a {...props}>{children}</a>
}));

// Mock the report service
jest.mock('@/lib/api/services/report', () => {
  const actual = jest.requireActual('@/lib/api/services/report');
  return {
    ...actual,
    reportService: {
      getReportsSummary: jest.fn()
    }
  };
});

describe('ReportsPage', () => {
  const mockRecentReports = [
    {
      id: '1',
      name: 'Monthly Sales Report',
      type: ReportType.SALES,
      format: ReportFormat.PDF,
      parameters: { startDate: '2025-04-01', endDate: '2025-04-30' },
      frequency: ReportFrequency.MONTHLY,
      status: ReportStatus.COMPLETED,
      createdBy: 1,
      createdAt: '2025-05-01T12:00:00Z',
      updatedAt: '2025-05-01T12:30:00Z',
      lastGeneratedAt: '2025-05-01T12:30:00Z',
      fileUrl: '/uploads/reports/sales-report-1.pdf'
    },
    {
      id: '2',
      name: 'Inventory Stock Level Report',
      type: ReportType.INVENTORY,
      format: ReportFormat.EXCEL,
      parameters: { asOfDate: '2025-05-01' },
      frequency: ReportFrequency.WEEKLY,
      status: ReportStatus.COMPLETED,
      createdBy: 1,
      createdAt: '2025-05-02T10:00:00Z',
      updatedAt: '2025-05-02T10:15:00Z',
      lastGeneratedAt: '2025-05-02T10:15:00Z',
      fileUrl: '/uploads/reports/inventory-report-2.xlsx'
    }
  ];

  const mockReportCounts = {
    [ReportType.SALES]: 10,
    [ReportType.INVENTORY]: 7,
    [ReportType.ACCOUNTS_RECEIVABLE]: 5,
    [ReportType.CUSTOM]: 3,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the report service response
    (reportService.getReportsSummary as jest.Mock).mockResolvedValue({
      recentReports: mockRecentReports,
      reportCounts: mockReportCounts
    });
  });

  it('should render the reports dashboard with report type cards', async () => {
    render(<ReportsPage />);

    // Check that loading indicator is shown initially
    expect(screen.getByText('admin.reports.loading')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(reportService.getReportsSummary).toHaveBeenCalled();
    });

    // Check for report type cards
    await waitFor(() => {
      expect(screen.getByText('admin.reports.salesReports')).toBeInTheDocument();
      expect(screen.getByText('admin.reports.inventoryReports')).toBeInTheDocument();
      expect(screen.getByText('admin.reports.accountsReceivableReports')).toBeInTheDocument();
      expect(screen.getByText('admin.reports.customReports')).toBeInTheDocument();
    });
  });

  it('should display report statistics', async () => {
    render(<ReportsPage />);

    await waitFor(() => {
      // Check that the report counts are displayed
      expect(screen.getByText('10')).toBeInTheDocument(); // Sales reports count
      expect(screen.getByText('7')).toBeInTheDocument();  // Inventory reports count
      expect(screen.getByText('5')).toBeInTheDocument();  // AR reports count
      expect(screen.getByText('3')).toBeInTheDocument();  // Custom reports count
    });
  });

  it('should list recent reports', async () => {
    render(<ReportsPage />);

    await waitFor(() => {
      // Check that recent reports are listed
      expect(screen.getByText('Monthly Sales Report')).toBeInTheDocument();
      expect(screen.getByText('Inventory Stock Level Report')).toBeInTheDocument();
    });
  });

  it('should have working navigation links', async () => {
    render(<ReportsPage />);

    await waitFor(() => {
      // Check for links to specific report types
      const salesLink = screen.getByText('admin.reports.viewSalesReports');
      expect(salesLink.closest('a')).toHaveAttribute('href', '/admin/reports/sales');

      const inventoryLink = screen.getByText('admin.reports.viewInventoryReports');
      expect(inventoryLink.closest('a')).toHaveAttribute('href', '/admin/reports/inventory');

      const arLink = screen.getByText('admin.reports.viewARReports');
      expect(arLink.closest('a')).toHaveAttribute('href', '/admin/reports/accounts-receivable');

      const customLink = screen.getByText('admin.reports.viewCustomReports');
      expect(customLink.closest('a')).toHaveAttribute('href', '/admin/reports/custom');
    });
  });
});
