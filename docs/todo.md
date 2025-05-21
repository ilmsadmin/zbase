# Kế Hoạch Triển Khai Hệ Thống Quản Lý Bán Hàng (Admin và POS)

Tài liệu này liệt kê các task cần thực hiện để hoàn thiện hệ thống quản lý bán hàng theo thiết kế đã được mô tả trong `POS_design.md` và `database_design.md`.

## 1. Cơ Sở Dữ Liệu

### 1.1. Prisma Schema
- [x] Tạo schema ban đầu (đã hoàn thành)
- [x] Hoàn thiện chi tiết cho các bảng còn thiếu (InvoiceItem, PriceList, PriceListItem, Transaction, Warranty)
- [x] Thêm các constraints và relationships còn thiếu
- [x] Tạo và áp dụng migrations

### 1.2. MongoDB
- [x] Thiết lập MongoDB schema validation
- [x] Tạo các collections: logs, inventory_logs, sales_analytics, analytics_reports, forecasting_models
- [x] Viết service để tương tác với MongoDB

### 1.3. Redis
- [x] Thiết lập Redis key patterns
- [x] Hoàn thiện service caching cho:
  - [x] Session management
  - [x] Product caching  - [x] Customer và Group caching
  - [x] Warehouse Location caching
  - [x] Report caching

## 2. Modules Backend (NestJS)

### 2.1. Modules Cơ Bản
- [x] Users module (đã hoàn thành)
- [x] Auth module (đã hoàn thành)
- [x] Roles module (đã hoàn thành)
- [x] Permissions module (đã hoàn thành)
- [x] Bổ sung permission cho các roles mới (admin, pos) - đã cài đặt
- [x] Vô hiệu hóa chức năng tự động quét controllers để tạo permissions
- [x] Cập nhật permissions cho các module mới (warehouses, products, v.v)

### 2.2. Module Kho Hàng
- [x] Tạo Warehouses module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests
- [x] Tạo Warehouse-Locations module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests

### 2.3. Module Sản Phẩm
- [x] Tạo Products module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests
- [x] Tạo ProductCategories module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests
- [x] Tạo ProductAttributes module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests

### 2.4. Module Inventory
- [ ] Tạo Inventory module
  - [ ] Controller
  - [ ] Service
  - [ ] DTO
  - [ ] Tests
- [ ] Tạo InventoryTransactions module (hoặc tích hợp vào Inventory)

### 2.5. Module Khách Hàng
- [ ] Tạo Customers module
  - [ ] Controller
  - [ ] Service
  - [ ] DTO
  - [ ] Tests
- [ ] Tạo CustomerGroups module
  - [ ] Controller
  - [ ] Service
  - [ ] DTO
  - [ ] Tests

### 2.6. Module Đối Tác
- [ ] Tạo Partners module
  - [ ] Controller
  - [ ] Service
  - [ ] DTO
  - [ ] Tests

### 2.7. Module Bán Hàng
- [ ] Tạo Invoices module
  - [ ] Controller
  - [ ] Service
  - [ ] DTO
  - [ ] Tests
- [ ] Tạo InvoiceItems module (hoặc tích hợp vào Invoices)

### 2.8. Module POS
- [ ] Tạo Shifts module
  - [ ] Controller
  - [ ] Service
  - [ ] DTO
  - [ ] Tests
- [ ] Tạo POS module tích hợp:
  - [ ] Quản lý ca làm việc
  - [ ] Bán hàng nhanh
  - [ ] Kiểm tra tồn kho real-time

### 2.9. Module Giá và Khuyến Mãi
- [ ] Tạo PriceLists module
  - [ ] Controller
  - [ ] Service
  - [ ] DTO
  - [ ] Tests

### 2.10. Module Thu Chi
- [ ] Tạo Transactions module
  - [ ] Controller
  - [ ] Service
  - [ ] DTO
  - [ ] Tests

### 2.11. Module Bảo Hành
- [ ] Tạo Warranties module
  - [ ] Controller
  - [ ] Service
  - [ ] DTO
  - [ ] Tests

### 2.12. Module Báo Cáo
- [ ] Tạo Reports module
  - [ ] Controller
  - [ ] Service
  - [ ] Tích hợp với MongoDB cho phân tích nâng cao
  - [ ] DTO
  - [ ] Tests
- [ ] Tạo Report Templates module
  - [ ] Controller
  - [ ] Service
  - [ ] DTO

## 3. Frontend (NextJS)

### 3.1. Giao Diện Admin

#### 3.1.1. Layout và Components
- [ ] Layout admin
- [ ] Sidebar navigation
- [ ] Breadcrumbs
- [ ] Dashboard components
- [ ] Table components với sorting, filtering, pagination
- [ ] Form components
- [ ] Modal components
- [ ] Charts và biểu đồ cho dashboard

#### 3.1.2. Pages Admin
- [ ] Dashboard
- [ ] Quản lý kho hàng
  - [ ] Danh sách kho
  - [ ] Chi tiết kho
  - [ ] Quản lý vị trí lưu trữ
- [ ] Quản lý sản phẩm
  - [ ] Danh sách sản phẩm
  - [ ] Thêm/sửa sản phẩm
  - [ ] Danh mục sản phẩm
  - [ ] Thuộc tính sản phẩm
- [ ] Quản lý tồn kho
  - [ ] Xem tồn kho
  - [ ] Xuất/nhập kho
  - [ ] Lịch sử tồn kho
- [ ] Quản lý khách hàng
  - [ ] Danh sách khách hàng
  - [ ] Chi tiết khách hàng
  - [ ] Nhóm khách hàng
- [ ] Quản lý đối tác
  - [ ] Danh sách đối tác
  - [ ] Chi tiết đối tác
- [ ] Quản lý hóa đơn
  - [ ] Danh sách hóa đơn
  - [ ] Chi tiết hóa đơn
  - [ ] Tạo hóa đơn mới
- [ ] Quản lý phiếu thu/chi
  - [ ] Danh sách phiếu
  - [ ] Tạo phiếu mới
- [ ] Quản lý bảo hành
  - [ ] Danh sách yêu cầu
  - [ ] Chi tiết và xử lý
- [ ] Báo cáo và phân tích
  - [ ] Báo cáo doanh thu
  - [ ] Báo cáo tồn kho
  - [ ] Báo cáo công nợ
  - [ ] Tùy chỉnh báo cáo
- [ ] Quản lý nhân viên
  - [ ] Danh sách nhân viên
  - [ ] Phân quyền

### 3.2. Giao Diện POS

#### 3.2.1. Layout và Components
- [ ] Layout POS
- [ ] Màn hình bán hàng
- [ ] Màn hình quản lý ca
- [ ] Màn hình bảo hành
- [ ] Components cho POS (product cards, cart, payment, etc.)

#### 3.2.2. Pages POS
- [ ] Đăng nhập POS
- [ ] Màn hình chính
- [ ] Quản lý ca làm việc
  - [ ] Mở ca
  - [ ] Đóng ca
  - [ ] Báo cáo ca
- [ ] Bán hàng
  - [ ] Tìm kiếm sản phẩm
  - [ ] Giỏ hàng
  - [ ] Thanh toán
  - [ ] In hóa đơn
- [ ] Kiểm tra bảo hành
  - [ ] Tra cứu bảo hành
  - [ ] Tạo yêu cầu mới

## 4. Tích Hợp và Testing

### 4.1. API Integration
- [ ] Tạo API client cho frontend
- [ ] Xây dựng hooks cho các API calls
- [ ] Cài đặt state management (React Context/Redux)
- [ ] Authentication flow

### 4.2. Testing
- [ ] Unit tests cho services
- [ ] E2E tests cho API
- [ ] Integration tests
- [ ] UI testing

## 5. Triển Khai

### 5.1. Docker
- [x] Cập nhật docker-compose.yml
- [x] Cấu hình volumes
- [ ] Tạo Dockerfiles cho frontend và backend

### 5.2. CI/CD
- [ ] Thiết lập CI/CD pipeline
- [ ] Automated testing
- [ ] Deployment scripts

## 6. Tài Liệu

### 6.1. Tài Liệu Kỹ Thuật
- [ ] API Documentation
- [ ] Database schema documentation
- [ ] Architecture diagram

### 6.2. Tài Liệu Người Dùng
- [ ] Hướng dẫn sử dụng Admin
- [ ] Hướng dẫn sử dụng POS
- [ ] FAQs

## 7. Kế Hoạch Triển Khai Theo Phases

### 7.1. Phase 1: Cơ Sở Hạ Tầng
- [x] Hoàn thiện database schemas
- [x] Setup Redis caching
- [x] Xây dựng khung API cơ bản
- [ ] Xây dựng layout frontend

### 7.2. Phase 2: Core Features Admin
- [x] Quản lý kho hàng
- [x] Quản lý sản phẩm
- [ ] Quản lý tồn kho
- [ ] Quản lý khách hàng
- [ ] Quản lý đối tác

### 7.3. Phase 3: Core Features POS
- [ ] Quản lý ca làm việc
- [ ] Bán hàng
- [ ] Quản lý hóa đơn

### 7.4. Phase 4: Advanced Features
- [ ] Báo cáo và phân tích
- [ ] Bảo hành
- [ ] Tùy chỉnh giá theo nhóm khách hàng

### 7.5. Phase 5: Hoàn Thiện
- [ ] Testing và sửa lỗi
- [ ] Tối ưu hiệu năng
- [ ] Viết tài liệu
