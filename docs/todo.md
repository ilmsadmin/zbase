# Kế Hoạch Triển Khai Hệ Thống Quản Lý Bán Hàng (Admin và POS)

Tài liệu này liệt kê các task cần thực hiện để hoàn thiện hệ thống quản lý bán hàng theo thiết kế đã được mô tả trong `POS_design.md` và `database_design.md`.

## Tình Trạng Hiện Tại (cập nhật 21/05/2025)
- **Hoàn thành**: Tất cả các module Backend đã được phát triển và kiểm thử
- **Hoàn thành**: Phần Admin Dashboard, quản lý kho hàng, quản lý sản phẩm, quản lý tồn kho và quản lý bảo hành
- **Hoàn thành một phần**: Quản lý giao dịch (transactions)
- **Đang triển khai**: Phần quản lý khách hàng, đối tác, hóa đơn và các chức năng còn lại
- **Kế hoạch tiếp theo**: Hoàn thiện báo cáo và phân tích, sau đó phát triển POS

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
- [x] Tạo Inventory module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests
- [x] Tạo InventoryTransactions module (đã tích hợp vào Inventory)
- [x] Cập nhật schema Prisma để phù hợp với module Inventory

### 2.5. Module Khách Hàng
- [x] Tạo Customers module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests
- [x] Tạo CustomerGroups module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests
- [x] Cập nhật schema Prisma để phù hợp với module Customers và CustomerGroups

### 2.6. Module Đối Tác
- [x] Tạo Partners module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests

### 2.7. Module Bán Hàng
- [x] Tạo Invoices module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests
- [x] Tạo InvoiceItems module (đã tích hợp vào Invoices)

### 2.8. Module POS
- [x] Tạo Shifts module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests
- [x] Tạo POS module tích hợp:
  - [x] Quản lý ca làm việc
  - [x] Bán hàng nhanh
  - [x] Kiểm tra tồn kho real-time

### 2.9. Module Giá và Khuyến Mãi
- [x] Tạo PriceLists module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests

### 2.10. Module Thu Chi
- [x] Tạo Transactions module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests

### 2.11. Module Bảo Hành
- [x] Tạo Warranties module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests

### 2.12. Module Báo Cáo
- [x] Tạo Reports module
  - [x] Controller
  - [x] Service
  - [x] Tích hợp với MongoDB cho phân tích nâng cao
  - [x] DTO
  - [x] Tests
- [x] Tạo Report Templates module
  - [x] Controller
  - [x] Service
  - [x] DTO

## 3. Frontend (NextJS)

### 3.1. Giao Diện Admin

#### Công Việc Đã Hoàn Thành Mới (21/05/2025)
- [x] Hoàn thiện chức năng quản lý giao dịch (transactions)
  - [x] Danh sách giao dịch với tìm kiếm và lọc nâng cao
  - [x] Trang chi tiết giao dịch
  - [x] Chỉnh sửa giao dịch
  - [x] Tạo giao dịch mới

- [x] Hoàn thiện chức năng quản lý bảo hành
  - [x] Xây dựng API client service cho module bảo hành
  - [x] Trang liệt kê yêu cầu bảo hành với tìm kiếm và lọc
  - [x] Trang chi tiết yêu cầu bảo hành
  - [x] Trang chỉnh sửa và cập nhật trạng thái bảo hành
  - [x] Trang tạo yêu cầu bảo hành mới

#### 3.1.1. Layout và Components
- [x] Layout admin
- [x] Sidebar navigation
- [x] Breadcrumbs
- [x] Dashboard components
- [x] Table components với sorting, filtering, pagination
- [x] Form components
- [x] Modal components
- [x] Charts và biểu đồ cho dashboard

#### 3.1.2. Pages Admin
- [x] Dashboard
- [x] Quản lý kho hàng
  - [x] Danh sách kho
  - [x] Chi tiết kho
  - [x] Quản lý vị trí lưu trữ
- [x] Quản lý sản phẩm
  - [x] Danh sách sản phẩm
  - [x] Thêm/sửa sản phẩm
  - [x] Danh mục sản phẩm
  - [x] Thuộc tính sản phẩm
- [x] Quản lý tồn kho
  - [x] Xem tồn kho
  - [x] Xuất/nhập kho
  - [x] Lịch sử tồn kho
- [x] Quản lý khách hàng
  - [x] Danh sách khách hàng
  - [x] Chi tiết khách hàng
  - [x] Nhóm khách hàng
- [x] Quản lý đối tác
  - [x] Danh sách đối tác
  - [x] Chi tiết đối tác
- [x] Quản lý hóa đơn
  - [x] Danh sách hóa đơn
  - [x] Chi tiết hóa đơn
  - [x] Tạo hóa đơn mới
- [x] Quản lý phiếu thu/chi
  - [x] Danh sách phiếu
  - [x] Tạo phiếu mới
- [x] Quản lý bảo hành
  - [x] Danh sách yêu cầu
  - [x] Chi tiết và xử lý
  - [x] Tạo và cập nhật yêu cầu bảo hành
- [x] Báo cáo và phân tích
  - [x] Báo cáo doanh thu
  - [x] Báo cáo tồn kho
  - [x] Báo cáo công nợ
  - [x] Tùy chỉnh báo cáo
- [x] Quản lý nhân viên
  - [x] Danh sách nhân viên
  - [x] Phân quyền

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
- [x] Tạo API client cho frontend
- [x] Xây dựng hooks cho các API calls
- [x] Cài đặt state management (React Context/Redux)
- [x] Authentication flow

### 4.2. Testing
- [ ] Unit tests cho services
- [ ] E2E tests cho API
- [ ] Integration tests
- [ ] UI testing

## 5. Triển Khai

### 5.1. Docker
- [x] Cập nhật docker-compose.yml
- [x] Cấu hình volumes
- [x] Tạo Dockerfiles cho frontend và backend

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
- [x] Xây dựng layout frontend

### 7.2. Phase 2: Core Features Admin
- [x] Quản lý kho hàng
- [x] Quản lý sản phẩm
- [x] Quản lý tồn kho
- [ ] Quản lý khách hàng
- [ ] Quản lý đối tác

### 7.3. Phase 3: Core Features POS
- [ ] Quản lý ca làm việc
- [ ] Bán hàng
- [ ] Quản lý hóa đơn

### 7.4. Phase 4: Advanced Features
- [x] Báo cáo và phân tích
- [x] Bảo hành
- [ ] Tùy chỉnh giá theo nhóm khách hàng

### 7.5. Phase 5: Hoàn Thiện
- [ ] Testing và sửa lỗi
- [ ] Tối ưu hiệu năng
- [ ] Viết tài liệu
