# Todo List Chi Tiết: Hệ Thống Quản Lý Bán Hàng (Admin và POS)

## 1. Cài đặt và Cấu hình Cơ sở dữ liệu

### 1.1. PostgreSQL
- [x] Tích hợp schema-pos.prisma vào schema.prisma chính
- [x] Tạo migrations cho cơ sở dữ liệu
- [x] Seed dữ liệu mẫu cho testing (danh mục, sản phẩm, kho, nhân viên)
- [x] Tạo các procedures/triggers cần thiết (ví dụ: cập nhật tồn kho khi bán hàng)

### 1.2. MongoDB
- [x] Thiết lập collections:
- [x] `logs`: Lưu lịch sử hành động (xuất/nhập kho, bán hàng, bảo hành)
- [x] Thiết lập indexes cho hiệu suất truy vấn

### 1.3. Redis
- [x] Cấu hình lưu trữ session JWT
- [x] Cấu hình cache cho sản phẩm (`products:<warehouse_id>`)
- [x] Cấu hình cache cho danh mục (`categories`)
- [x] Thiết lập TTL và cơ chế invalidation khi dữ liệu thay đổi

## 2. Phát triển Backend

### 2.1. Module Kho hàng (WarehouseModule)
- [ ] Tạo model, DTO, và entities
- [ ] Tạo controller với các endpoints:
  - [ ] GET `/warehouses` - Lấy danh sách kho
  - [ ] GET `/warehouses/:id` - Lấy thông tin kho theo ID
  - [ ] POST `/warehouses` - Tạo kho mới
  - [ ] PUT `/warehouses/:id` - Cập nhật thông tin kho
  - [ ] DELETE `/warehouses/:id` - Xóa kho
- [ ] Tạo service với các methods tương ứng
- [ ] Tạo unit tests

### 2.2. Module Sản phẩm (ProductModule)
- [ ] Tạo model, DTO, và entities cho sản phẩm và danh mục
- [ ] Tạo controller với các endpoints:
  - [ ] GET `/products` - Lấy danh sách sản phẩm (có phân trang, lọc)
  - [ ] GET `/products/:id` - Lấy thông tin sản phẩm theo ID
  - [ ] POST `/products` - Tạo sản phẩm mới
  - [ ] PUT `/products/:id` - Cập nhật thông tin sản phẩm
  - [ ] DELETE `/products/:id` - Xóa sản phẩm
  - [ ] GET `/categories` - Lấy danh sách danh mục
  - [ ] POST `/categories` - Tạo danh mục mới
  - [ ] PUT `/categories/:id` - Cập nhật danh mục
  - [ ] DELETE `/categories/:id` - Xóa danh mục
- [ ] Tạo service với các methods tương ứng
- [ ] Cấu hình cache Redis cho sản phẩm
- [ ] Tạo unit tests

### 2.3. Module Tồn kho (InventoryModule)
- [ ] Tạo model, DTO, và entities
- [ ] Tạo controller với các endpoints:
  - [ ] GET `/inventory` - Lấy danh sách tồn kho
  - [ ] GET `/inventory/warehouse/:warehouseId` - Lấy tồn kho theo kho
  - [ ] GET `/inventory/product/:productId` - Lấy tồn kho theo sản phẩm
  - [ ] POST `/inventory/import` - Nhập hàng vào kho
  - [ ] POST `/inventory/export` - Xuất hàng từ kho
- [ ] Tạo service với các methods tương ứng
- [ ] Cấu hình ghi log vào MongoDB khi xuất/nhập kho
- [ ] Tạo unit tests

### 2.4. Module Khách hàng (CustomerModule)
- [ ] Tạo model, DTO, và entities
- [ ] Tạo controller với các endpoints:
  - [ ] GET `/customers` - Lấy danh sách khách hàng
  - [ ] GET `/customers/:id` - Lấy thông tin khách hàng theo ID
  - [ ] POST `/customers` - Tạo khách hàng mới
  - [ ] PUT `/customers/:id` - Cập nhật thông tin khách hàng
  - [ ] DELETE `/customers/:id` - Xóa khách hàng
  - [ ] GET `/customers/:id/invoices` - Xem lịch sử mua hàng của khách
  - [ ] GET `/customers/:id/debt` - Xem công nợ của khách
- [ ] Tạo service với các methods tương ứng
- [ ] Tạo unit tests

### 2.5. Module Đối tác (PartnerModule)
- [ ] Tạo model, DTO, và entities
- [ ] Tạo controller với các endpoints:
  - [ ] GET `/partners` - Lấy danh sách đối tác
  - [ ] GET `/partners/:id` - Lấy thông tin đối tác theo ID
  - [ ] POST `/partners` - Tạo đối tác mới
  - [ ] PUT `/partners/:id` - Cập nhật thông tin đối tác
  - [ ] DELETE `/partners/:id` - Xóa đối tác
  - [ ] GET `/partners/:id/debt` - Xem công nợ của đối tác
- [ ] Tạo service với các methods tương ứng
- [ ] Tạo unit tests

### 2.6. Module Hóa đơn (InvoiceModule)
- [ ] Tạo model, DTO, và entities cho hóa đơn và chi tiết hóa đơn
- [ ] Tạo controller với các endpoints:
  - [ ] GET `/invoices` - Lấy danh sách hóa đơn
  - [ ] GET `/invoices/:id` - Lấy thông tin hóa đơn theo ID
  - [ ] POST `/invoices` - Tạo hóa đơn mới
  - [ ] PUT `/invoices/:id` - Cập nhật hóa đơn
  - [ ] PUT `/invoices/:id/status` - Cập nhật trạng thái hóa đơn
  - [ ] DELETE `/invoices/:id` - Xóa hóa đơn
- [ ] Tạo service với logic xử lý:
  - [ ] Tạo hóa đơn và cập nhật tồn kho
  - [ ] Cập nhật công nợ khách hàng khi tạo hóa đơn
  - [ ] Ghi log khi tạo/cập nhật hóa đơn
- [ ] Tạo unit tests

### 2.7. Module Phiếu thu/chi (TransactionModule)
- [ ] Tạo model, DTO, và entities
- [ ] Tạo controller với các endpoints:
  - [ ] GET `/transactions` - Lấy danh sách phiếu thu/chi
  - [ ] GET `/transactions/:id` - Lấy thông tin phiếu theo ID
  - [ ] POST `/transactions` - Tạo phiếu mới
  - [ ] PUT `/transactions/:id` - Cập nhật phiếu
  - [ ] DELETE `/transactions/:id` - Xóa phiếu
- [ ] Tạo service với logic xử lý:
  - [ ] Cập nhật công nợ khách hàng/đối tác khi tạo phiếu
  - [ ] Ghi log khi tạo/cập nhật phiếu
- [ ] Tạo unit tests

### 2.8. Module Bảo hành (WarrantyModule)
- [ ] Tạo model, DTO, và entities
- [ ] Tạo controller với các endpoints:
  - [ ] GET `/warranties` - Lấy danh sách bảo hành
  - [ ] GET `/warranties/:id` - Lấy thông tin bảo hành theo ID
  - [ ] GET `/warranties/product/:productId` - Kiểm tra bảo hành theo sản phẩm
  - [ ] GET `/warranties/invoice/:invoiceId` - Kiểm tra bảo hành theo hóa đơn
  - [ ] POST `/warranties` - Tạo yêu cầu bảo hành mới
  - [ ] PUT `/warranties/:id/status` - Cập nhật trạng thái bảo hành
- [ ] Tạo service với các methods tương ứng
- [ ] Tạo unit tests

### 2.9. Module Ca làm việc (ShiftModule)
- [ ] Tạo model, DTO, và entities
- [ ] Tạo controller với các endpoints:
  - [ ] GET `/shifts` - Lấy danh sách ca làm việc
  - [ ] GET `/shifts/:id` - Lấy thông tin ca làm việc theo ID
  - [ ] POST `/shifts/open` - Mở ca mới
  - [ ] PUT `/shifts/:id/close` - Đóng ca
- [ ] Tạo service với logic xử lý:
  - [ ] Tính doanh thu khi đóng ca
  - [ ] Ghi log khi mở/đóng ca
- [ ] Tạo unit tests

### 2.10. Module Báo cáo (ReportModule)
- [ ] Tạo controller với các endpoints:
  - [ ] GET `/reports/revenue` - Báo cáo doanh thu (ngày, tuần, tháng)
  - [ ] GET `/reports/revenue/employee` - Báo cáo doanh thu theo nhân viên
  - [ ] GET `/reports/revenue/warehouse` - Báo cáo doanh thu theo kho
  - [ ] GET `/reports/inventory` - Báo cáo tồn kho
  - [ ] GET `/reports/inventory/low` - Báo cáo sản phẩm tồn thấp
  - [ ] GET `/reports/debt` - Báo cáo công nợ
  - [ ] GET `/reports/performance` - Báo cáo hiệu suất nhân viên
- [ ] Tạo service với logic tổng hợp dữ liệu
- [ ] Cấu hình cache Redis cho báo cáo
- [ ] Tạo unit tests

### 2.11. Mở rộng Module Auth và Users
- [ ] Thêm các roles mới (`admin`, `pos`)
- [ ] Cập nhật guard kiểm tra permissions cho các API mới
- [ ] Cập nhật actions-discovery.service.ts để quét routes mới
- [ ] Cập nhật JWT payload để bao gồm thông tin cần thiết

### 2.12. Cấu hình chung
- [ ] Cập nhật app.module.ts để import tất cả các modules mới
- [ ] Cập nhật main.ts để thiết lập global prefix, CORS, v.v.
- [ ] Cấu hình logging cho các actions quan trọng (xuất/nhập kho, bán hàng)

## 3. Phát triển Frontend

### 3.1. Components chung
- [ ] Tạo layouts cho Admin và POS
- [ ] Tạo components cho bảng dữ liệu (Table)
- [ ] Tạo components cho form (Input, Select, DatePicker, v.v.)
- [ ] Tạo components cho biểu đồ báo cáo (Chart.js)
- [ ] Tạo components cho modal, alerts, notifications

### 3.2. Giao diện Admin
- [ ] Tạo trang chủ Admin (Dashboard)
- [ ] Tạo trang quản lý kho (/admin/warehouses)
- [ ] Tạo trang quản lý sản phẩm (/admin/products)
- [ ] Tạo trang quản lý danh mục (/admin/categories)
- [ ] Tạo trang quản lý tồn kho (/admin/inventory)
- [ ] Tạo trang quản lý khách hàng (/admin/customers)
- [ ] Tạo trang quản lý đối tác (/admin/partners)
- [ ] Tạo trang quản lý hóa đơn (/admin/invoices)
- [ ] Tạo trang quản lý phiếu thu/chi (/admin/transactions)
- [ ] Tạo trang quản lý bảo hành (/admin/warranties)
- [ ] Tạo trang báo cáo (/admin/reports) với các tab:
  - [ ] Báo cáo doanh thu
  - [ ] Báo cáo tồn kho
  - [ ] Báo cáo công nợ
  - [ ] Báo cáo hiệu suất nhân viên
- [ ] Tạo trang quản lý nhân viên (/admin/employees)

### 3.3. Giao diện POS
- [ ] Tạo trang đăng nhập cho nhân viên POS
- [ ] Tạo trang quản lý ca làm việc (/pos/shifts)
- [ ] Tạo trang bán hàng (/pos/sales) với các tính năng:
  - [ ] Chọn sản phẩm (tìm kiếm, lọc)
  - [ ] Thêm sản phẩm vào giỏ hàng
  - [ ] Áp dụng khuyến mãi
  - [ ] Chọn phương thức thanh toán
  - [ ] In hóa đơn
- [ ] Tạo trang kiểm tra và tạo bảo hành (/pos/warranties)

### 3.4. Tích hợp Auth và RBAC
- [ ] Cập nhật context Auth cho Frontend
- [ ] Cập nhật abilities/permissions để phù hợp với roles mới
- [ ] Triển khai guards cho các routes dựa trên role

### 3.5. API Integration
- [ ] Tạo các services để gọi API từ Backend
- [ ] Cấu hình interceptors để xử lý JWT và lỗi

## 4. Tích hợp và Triển khai

### 4.1. Cấu hình Docker
- [ ] Cập nhật docker-compose.yml nếu cần
- [ ] Tạo các Dockerfile tùy chỉnh nếu cần

### 4.2. Tối ưu hóa
- [ ] Tối ưu hiệu suất Backend (query optimization, caching)
- [ ] Tối ưu hiệu suất Frontend (code splitting, lazy loading)
- [ ] Tối ưu cơ sở dữ liệu (indexes, partitioning nếu cần)

### 4.3. Bảo mật
- [ ] Đảm bảo mã hóa password bằng bcrypt
- [ ] Cấu hình HTTPS cho API
- [ ] Giới hạn quyền truy cập cho role POS
- [ ] Triển khai rate limiting và CORS

### 4.4. Testing
- [ ] Viết unit tests cho Backend
- [ ] Viết unit tests cho Frontend
- [ ] Viết integration tests
- [ ] Viết end-to-end tests

### 4.5. CI/CD
- [ ] Thiết lập pipeline CI/CD
- [ ] Cấu hình deployment tự động

### 4.6. Môi trường
- [ ] Cấu hình môi trường development
- [ ] Cấu hình môi trường staging
- [ ] Cấu hình môi trường production

## 5. Documentation

- [ ] Viết tài liệu API (Swagger)
- [ ] Viết tài liệu hệ thống
- [ ] Viết tài liệu hướng dẫn sử dụng cho Admin
- [ ] Viết tài liệu hướng dẫn sử dụng cho nhân viên POS
