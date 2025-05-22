export default {
  // Common report terms
  title: 'Báo cáo',
  description: 'Tạo và quản lý báo cáo bán hàng, tồn kho và dữ liệu tài chính.',
  loading: 'Đang tải báo cáo...',
  noReports: 'Không tìm thấy báo cáo nào.',
  
  // Report types
  salesReports: 'Báo cáo bán hàng',
  inventoryReports: 'Báo cáo tồn kho',
  accountsReceivableReports: 'Báo cáo công nợ phải thu',
  customReports: 'Báo cáo tùy chỉnh',
  
  // Dashboard
  reportsOverview: 'Tổng quan báo cáo',
  recentReports: 'Báo cáo gần đây',
  savedReports: 'Báo cáo đã lưu',
  scheduledReports: 'Báo cáo theo lịch',
  
  // Actions
  generateReport: 'Tạo báo cáo',
  viewReport: 'Xem báo cáo',
  downloadReport: 'Tải báo cáo',
  editReport: 'Sửa báo cáo',
  deleteReport: 'Xóa báo cáo',
  saveReport: 'Lưu báo cáo',
  scheduleReport: 'Lịch báo cáo',
  shareReport: 'Chia sẻ báo cáo',
  
  // Navigation
  viewSalesReports: 'Xem báo cáo bán hàng',
  viewInventoryReports: 'Xem báo cáo tồn kho',
  viewARReports: 'Xem báo cáo công nợ',
  viewCustomReports: 'Xem báo cáo tùy chỉnh',
  backToReports: 'Quay lại báo cáo',
  
  // Report formats
  pdfFormat: 'PDF',
  excelFormat: 'Excel',
  csvFormat: 'CSV',
  jsonFormat: 'JSON',

  // Frequency options
  once: 'Một lần',
  daily: 'Hàng ngày',
  weekly: 'Hàng tuần',
  monthly: 'Hàng tháng',
  quarterly: 'Hàng quý',
  
  // Status
  pending: 'Đang chờ',
  processing: 'Đang xử lý',
  completed: 'Đã hoàn thành',
  failed: 'Thất bại',
  
  // Report parameters
  dateRange: 'Phạm vi ngày',
  startDate: 'Ngày bắt đầu',
  endDate: 'Ngày kết thúc',
  groupBy: 'Nhóm theo',
  sortBy: 'Sắp xếp theo',
  filterBy: 'Lọc theo',
  includeRefunds: 'Bao gồm hoàn tiền',
  asOfDate: 'Tính đến ngày',
  warehouse: 'Kho hàng',
  product: 'Sản phẩm',
  category: 'Danh mục',
  customer: 'Khách hàng',
  customerGroup: 'Nhóm khách hàng',
  
  // Sales report specific
  salesOverview: 'Tổng quan bán hàng',
  totalSales: 'Tổng doanh số',
  totalOrders: 'Tổng đơn hàng',
  avgOrderValue: 'Giá trị đơn hàng TB',
  topSellingProduct: 'Sản phẩm bán chạy nhất',
  topSellingCategory: 'Danh mục bán chạy nhất',
  salesByDay: 'Doanh số theo ngày',
  salesByWeek: 'Doanh số theo tuần',
  salesByMonth: 'Doanh số theo tháng',
  salesByProduct: 'Doanh số theo sản phẩm',
  salesByCategory: 'Doanh số theo danh mục',
  salesByCustomer: 'Doanh số theo khách hàng',
  
  // Inventory report specific
  inventoryOverview: 'Tổng quan tồn kho',
  totalProducts: 'Tổng sản phẩm',
  lowStockItems: 'Sản phẩm sắp hết',
  outOfStockItems: 'Sản phẩm hết hàng',
  inventoryValue: 'Giá trị tồn kho',
  inventoryTurnover: 'Vòng quay tồn kho',
  avgProductValue: 'Giá trị sản phẩm TB',
  stockByWarehouse: 'Tồn kho theo kho',
  stockByCategory: 'Tồn kho theo danh mục',
  stockMovement: 'Biến động tồn kho',
  
  // Accounts receivable specific
  accountsReceivableOverview: 'Tổng quan công nợ',
  totalReceivables: 'Tổng công nợ',
  currentReceivables: 'Công nợ hiện tại',
  overdueReceivables: 'Công nợ quá hạn',
  agingReceivables: 'Tuổi nợ',
  avgDaysToPay: 'Số ngày thanh toán TB',
  receivablesByCustomer: 'Công nợ theo khách hàng',
  aging30: '1-30 ngày',
  aging60: '31-60 ngày',
  aging90: '61-90 ngày', 
  aging90Plus: '90+ ngày',
  
  // Custom report specific
  templates: 'Mẫu báo cáo',
  templateName: 'Tên mẫu',
  description: 'Mô tả',
  type: 'Loại',
  defaultFormat: 'Định dạng mặc định',
  parameters: 'Tham số',
  createdAt: 'Ngày tạo',
  lastRun: 'Chạy lần cuối',
  actions: 'Thao tác',
  newTemplate: 'Mẫu mới',
  editTemplate: 'Sửa mẫu',
  deleteTemplate: 'Xóa mẫu',
  confirmDeleteTemplate: 'Bạn có chắc muốn xóa mẫu này?',
  entitySelection: 'Chọn đối tượng',
  metricSelection: 'Chọn chỉ số',
  filterConfiguration: 'Cấu hình bộ lọc',
  visualization: 'Tùy chọn hiển thị',
  
  // Error messages
  errorLoading: 'Lỗi khi tải báo cáo',
  errorGenerating: 'Lỗi khi tạo báo cáo',
  errorSaving: 'Lỗi khi lưu báo cáo',
  errorDeleting: 'Lỗi khi xóa báo cáo',
  
  // Confirmation messages
  reportGenerated: 'Báo cáo được tạo thành công',
  reportSaved: 'Báo cáo được lưu thành công',
  reportDeleted: 'Báo cáo được xóa thành công',
  reportScheduled: 'Báo cáo đã được lên lịch thành công',
};
