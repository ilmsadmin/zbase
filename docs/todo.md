# Kế Hoạch Triển Khai Hệ Thống Quản Lý Bán Hàng (Admin và POS)

Tài liệu này liệt kê các task cần thực hiện để hoàn thiện hệ thống quản lý bán hàng theo thiết kế đã được mô tả trong `POS_design.md` và `database_design.md`.

## Tình Trạng Hiện Tại (cập nhật 22/05/2025)
- **Hoàn thành**: Tất cả các module Backend### 8.1. Phase 1: Cơ Sở Hạ Tầng
- [x] Hoàn thiện database schemas
- [x] Setup Redis caching
- [x] Xây dựng khung API cơ bản
- [x] Xây dựng layout frontendược phát triển và kiểm thử
- **Hoàn thành**: Phần Admin Dashboard, quản lý kho hàng, quản lý sản phẩm, quản lý tồn kho và quản lý bảo hành
- **Hoàn thành**: Quản lý giao dịch (transactions)
- **Hoàn thành**: Tích hợp máy quét mã vạch (barcode scanner) cho POS với hỗ trợ đa định dạng mã vạch và chế độ ngoại tuyến
- **Đang triển khai**: Phần quản lý khách hàng, đối tác, hóa đơn và các chức năng còn lại của POS
- **Kế hoạch tiếp theo**: Hoàn thiện báo cáo và phân tích, tiếp tục phát triển giao diện POS

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
- [x] Layout POS
- [x] Màn hình bán hàng 
- [x] Màn hình quản lý ca
- [x] Màn hình bảo hành
- [x] Components cho POS (product cards, cart, payment)
- [x] Tích hợp máy quét mã vạch (barcode scanner)

#### 3.2.2. Pages POS
- [x] Đăng nhập POS
- [x] Màn hình chính
- [x] Quản lý ca làm việc
  - [x] Mở ca
  - [x] Đóng ca
  - [x] Báo cáo ca
- [x] Bán hàng
  - [x] Tìm kiếm sản phẩm
  - [x] Giỏ hàng
  - [x] Thanh toán
  - [x] In hóa đơn
- [x] Tích hợp máy quét mã vạch (barcode scanner)
  - [x] Quét và nhận diện mã vạch
  - [x] Hỗ trợ đa định dạng mã vạch (EAN-13, UPC-A, CODE-128, v.v.)
  - [x] Chế độ ngoại tuyến (offline mode)
  - [x] Xử lý mã vạch không hoàn chỉnh
- [x] Kiểm tra bảo hành
  - [x] Tra cứu bảo hành
  - [x] Tạo yêu cầu mới

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
- [ ] Testing máy quét mã vạch với các thiết bị thực tế:
  - [ ] Kiểm tra với các máy quét thông dụng (Symbol, Honeywell, Datalogic)
  - [ ] Kiểm tra với các định dạng mã vạch khác nhau
  - [ ] Kiểm tra khả năng phục hồi từ mã vạch không hoàn chỉnh
  - [ ] Kiểm tra chế độ ngoại tuyến và đồng bộ hóa

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
  - [ ] Hướng dẫn sử dụng máy quét mã vạch
  - [ ] Xử lý sự cố và tình huống ngoại lệ
  - [ ] Quy trình bán hàng với mã vạch
- [ ] FAQs

## 7. Tích Hợp Máy Quét Mã Vạch (Barcode Scanner)

### 7.1. Mô Tả
- [x] Tích hợp máy quét mã vạch vào giao diện bán hàng POS
- [x] Hỗ trợ đa định dạng mã vạch phổ biến trong bán lẻ
- [x] Xử lý các trường hợp ngoại tuyến và mã vạch bị lỗi

### 7.2. Chức Năng Đã Triển Khai
- [x] Nhận diện mã vạch từ nhiều định dạng khác nhau: EAN-13, UPC-A, UPC-E, CODE-128, CODE-39, ITF
- [x] Xác thực và kiểm tra tính hợp lệ của mã vạch
- [x] Khả năng khôi phục mã vạch không đầy đủ hoặc bị lỗi
- [x] Chế độ ngoại tuyến (offline mode) cho phép quét mã khi mất kết nối
- [x] Lưu trữ mã vạch đã quét trong bộ nhớ cục bộ (localStorage) để xử lý sau khi kết nối trở lại
- [x] Hiển thị thông báo trạng thái quét (thành công/lỗi)
- [x] Hiển thị thông tin về định dạng mã vạch đã phát hiện

### 7.3. Tính Năng Cần Phát Triển Thêm
- [ ] Kiểm thử với nhiều loại máy quét mã vạch thực tế
- [ ] Tùy chỉnh cấu hình cho từng loại máy quét cụ thể
- [ ] Mở rộng hỗ trợ cho mã QR và mã 2D
- [ ] Tối ưu hóa bộ nhớ cache ngoại tuyến cho dữ liệu sản phẩm

## 8. Kế Hoạch Triển Khai Theo Phases

### 8.1. Phase 1: Cơ Sở Hạ Tầng
- [x] Hoàn thiện database schemas
- [x] Setup Redis caching
- [x] Xây dựng khung API cơ bản
- [x] Xây dựng layout frontend

### 8.2. Phase 2: Core Features Admin
- [x] Quản lý kho hàng
- [x] Quản lý sản phẩm
- [x] Quản lý tồn kho
- [ ] Quản lý khách hàng
- [ ] Quản lý đối tác

### 8.3. Phase 3: Core Features POS
- [x] Quản lý ca làm việc
- [x] Bán hàng
  - [x] Tích hợp máy quét mã vạch
  - [x] Giỏ hàng và thanh toán
  - [x] Tìm kiếm sản phẩm
- [ ] Quản lý hóa đơn đầy đủ

### 8.4. Phase 4: Advanced Features
- [x] Báo cáo và phân tích
- [x] Bảo hành
- [ ] Tùy chỉnh giá theo nhóm khách hàng

### 8.5. Phase 5: Hoàn Thiện
- [ ] Testing và sửa lỗi
- [ ] Tối ưu hiệu năng
- [ ] Viết tài liệu
