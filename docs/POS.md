# Thiết Kế Hệ Thống Quản Lý Bán Hàng (Admin và POS)

Hệ thống quản lý bán hàng được xây dựng trên nền tảng base (NestJS, NextJS, PostgreSQL, MongoDB, Redis, Docker), hỗ trợ hai tầng người dùng: **Admin** (quản lý toàn diện) và **POS** (bán hàng, ca làm việc). Hệ thống tích hợp xác thực/phân quyền RBAC và tự động load actions từ API.

## 1. Tổng Quan Hệ Thống
- **Backend**: NestJS, cung cấp API cho quản lý kho, sản phẩm, khách hàng, đối tác, hóa đơn, phiếu thu/chi, bảo hành, báo cáo, nhân viên, ca làm việc, bán hàng.
- **Frontend**: NextJS với Tailwind CSS, cung cấp giao diện admin (quản lý) và POS (bán hàng, ca).
- **Cơ sở dữ liệu**:
  - **PostgreSQL**: Lưu trữ dữ liệu có cấu trúc (kho, sản phẩm, khách hàng, đối tác, hóa đơn, v.v.).
  - **MongoDB**: Lưu trữ logs (xuất/nhập kho, bán hàng, bảo hành).
  - **Redis**: Quản lý session JWT, cache sản phẩm/tồn kho.
- **Triển khai**: Docker Compose, tận dụng cấu hình hiện có.
- **Xác thực/phân quyền**: RBAC với roles (`admin`, `pos`), tự động load actions từ API.

## 2. Chức Năng Chính

### 2.1. Tầng Admin
1. **Quản lý kho hàng**:
   - Tạo/sửa/xóa kho (tên, địa chỉ, người phụ trách).
   - Theo dõi tồn kho theo sản phẩm/kho.
   - Thực hiện xuất/nhập kho, cập nhật tồn kho, ghi log.
   - Xem lịch sử xuất/nhập kho.
2. **Quản lý sản phẩm**:
   - Thêm/sửa/xóa sản phẩm (mã, tên, danh mục, giá, thuộc tính: màu, kích thước).
   - Gán sản phẩm vào kho với số lượng tồn.
3. **Quản lý khách hàng**:
   - Lưu thông tin (tên, điện thoại, email, địa chỉ).
   - Theo dõi lịch sử mua hàng, công nợ.
4. **Quản lý đối tác**:
   - Lưu thông tin nhà cung cấp/khách buôn (tên, liên hệ, hợp đồng).
   - Quản lý công nợ (nợ phải trả/được thu).
5. **Quản lý hóa đơn**:
   - Tạo/xem/sửa/xóa hóa đơn bán hàng (liên kết khách hàng, kho).
   - Trạng thái: Đã thanh toán, đang chờ, hủy.
6. **Quản lý phiếu thu/chi**:
   - Tạo phiếu thu (thu tiền khách) hoặc phiếu chi (thanh toán đối tác).
   - Ghi nhận số tiền, ngày, mục đích.
7. **Quản lý bảo hành**:
   - Tạo/theo dõi yêu cầu bảo hành (sản phẩm, khách hàng, thời hạn).
   - Xem lịch sử bảo hành.
8. **Báo cáo**:
   - Doanh thu (ngày, tuần, tháng, nhân viên, kho).
   - Tồn kho (sản phẩm, kho, cảnh báo tồn thấp).
   - Công nợ (khách hàng, đối tác).
   - Hiệu suất nhân viên (doanh thu ca, số hóa đơn).
9. **Quản lý nhân viên**:
   - Thêm/sửa/xóa nhân viên, gán vai trò (`admin`, `pos`).
   - Theo dõi hoạt động qua ca làm việc, hóa đơn.

### 2.2. Tầng POS
1. **Quản lý ca làm việc**:
   - Mở ca: Ghi nhận thời gian bắt đầu, tiền mặt ban đầu.
   - Đóng ca: Kiểm kê tiền mặt, tính doanh thu, gửi báo cáo.
2. **Bán hàng**:
   - Tạo hóa đơn: Chọn sản phẩm, số lượng, áp dụng khuyến mãi, thanh toán (tiền mặt, thẻ, ví điện tử).
   - Cập nhật tồn kho, ghi log bán hàng.
3. **Bảo hành**:
   - Kiểm tra trạng thái bảo hành (mã hóa đơn/sản phẩm).
   - Tạo yêu cầu bảo hành, gửi lên admin.

## 3. Luồng Thao Tác

### 3.1. Tầng Admin
1. **Quản lý kho hàng**:
   - Đăng nhập → Truy cập `/admin/warehouses`.
   - Tạo kho: Nhập tên, địa chỉ, người phụ trách.
   - Nhập/xuất kho: Chọn sản phẩm, số lượng, kho → Cập nhật tồn kho, log vào MongoDB.
   - Xem lịch sử hoặc báo cáo tồn kho.
2. **Quản lý sản phẩm**:
   - Truy cập `/admin/products`, thêm/sửa sản phẩm (mã, tên, giá, danh mục, thuộc tính).
   - Gán sản phẩm vào kho.
3. **Quản lý khách hàng/đối tác**:
   - Truy cập `/admin/customers` hoặc `/admin/partners`, thêm/sửa thông tin.
   - Xem lịch sử mua hàng, công nợ.
4. **Quản lý hóa đơn/phiếu thu/chi**:
   - Truy cập `/admin/invoices`, tạo/xem hóa đơn.
   - Truy cập `/admin/transactions`, tạo phiếu thu/chi, cập nhật công nợ.
5. **Quản lý bảo hành**:
   - Truy cập `/admin/warranties`, tạo/xem yêu cầu bảo hành.
   - Cập nhật trạng thái (đang xử lý, hoàn thành).
6. **Báo cáo**:
   - Truy cập `/admin/reports`, chọn loại báo cáo (doanh thu, tồn kho, công nợ).
   - Xem biểu đồ hoặc tải báo cáo (PDF/Excel).
7. **Quản lý nhân viên**:
   - Truy cập `/admin/employees`, thêm/sửa nhân viên, gán vai trò.
   - Theo dõi hoạt động qua ca hoặc hóa đơn.

### 3.2. Tầng POS
1. **Quản lý ca làm việc**:
   - Đăng nhập → Truy cập `/pos/shifts`.
   - Mở ca: Nhập tiền mặt ban đầu, lưu vào PostgreSQL.
   - Đóng ca: Kiểm kê tiền mặt, tính doanh thu, gửi báo cáo.
2. **Bán hàng**:
   - Truy cập `/pos/sales`, chọn sản phẩm (cache Redis).
   - Tạo hóa đơn: Thêm sản phẩm, khuyến mãi, thanh toán.
   - Gửi hóa đơn: Cập nhật tồn kho, log vào MongoDB.
3. **Bảo hành**:
   - Truy cập `/pos/warranties`, kiểm tra bảo hành (mã hóa đơn/sản phẩm).
   - Tạo yêu cầu bảo hành, gửi lên admin.

## 4. Thiết Kế Database

### 4.1. PostgreSQL
1. **warehouses**: Kho hàng
   - `id` (SERIAL, PK), `name` (VARCHAR), `address` (TEXT), `manager_id` (INTEGER, FK → users.id), `created_at` (TIMESTAMP), `updated_at` (TIMESTAMP).
2. **products**: Sản phẩm
   - `id` (SERIAL, PK), `code` (VARCHAR, UNIQUE), `name` (VARCHAR), `category_id` (INTEGER, FK → categories.id), `price` (DECIMAL), `attributes` (JSONB), `created_at` (TIMESTAMP).
3. **categories**: Danh mục sản phẩm
   - `id` (SERIAL, PK), `name` (VARCHAR), `description` (TEXT).
4. **inventory**: Tồn kho
   - `id` (SERIAL, PK), `product_id` (INTEGER, FK → products.id), `warehouse_id` (INTEGER, FK → warehouses.id), `quantity` (INTEGER), `last_updated` (TIMESTAMP).
5. **customers**: Khách hàng
   - `id` (SERIAL, PK), `name` (VARCHAR), `phone` (VARCHAR), `email` (VARCHAR, UNIQUE), `address` (TEXT), `debt` (DECIMAL), `created_at` (TIMESTAMP).
6. **partners**: Đối tác (nhà cung cấp/khách buôn)
   - `id` (SERIAL, PK), `name` (VARCHAR), `type` (ENUM: 'supplier', 'wholesaler'), `contact` (JSONB), `debt` (DECIMAL), `created_at` (TIMESTAMP).
7. **invoices**: Hóa đơn bán hàng
   - `id` (SERIAL, PK), `customer_id` (INTEGER, FK → customers.id), `warehouse_id` (INTEGER, FK → warehouses.id), `employee_id` (INTEGER, FK → users.id), `total_amount` (DECIMAL), `status` (ENUM: 'pending', 'paid', 'cancelled'), `created_at` (TIMESTAMP).
8. **invoice_details**: Chi tiết hóa đơn
   - `id` (SERIAL, PK), `invoice_id` (INTEGER, FK → invoices.id), `product_id` (INTEGER, FK → products.id), `quantity` (INTEGER), `unit_price` (DECIMAL), `discount` (DECIMAL).
9. **transactions**: Phiếu thu/chi
   - `id` (SERIAL, PK), `type` (ENUM: 'receipt', 'payment'), `customer_id` (INTEGER, FK → customers.id, NULLABLE), `partner_id` (INTEGER, FK → partners.id, NULLABLE), `amount` (DECIMAL), `description` (TEXT), `created_at` (TIMESTAMP).
10. **warranties**: Bảo hành
    - `id` (SERIAL, PK), `invoice_id` (INTEGER, FK → invoices.id), `product_id` (INTEGER, FK → products.id), `customer_id` (INTEGER, FK → customers.id), `start_date` (TIMESTAMP), `end_date` (TIMESTAMP), `status` (ENUM: 'active', 'expired', 'processed').
11. **shifts**: Ca làm việc
    - `id` (SERIAL, PK), `employee_id` (INTEGER, FK → users.id), `start_time` (TIMESTAMP), `end_time` (TIMESTAMP, NULLABLE), `initial_cash` (DECIMAL), `final_cash` (DECIMAL, NULLABLE), `revenue` (DECIMAL, NULLABLE).
12. **inventory_transactions**: Lịch sử xuất/nhập kho
    - `id` (SERIAL, PK), `type` (ENUM: 'import', 'export'), `product_id` (INTEGER, FK → products.id), `warehouse_id` (INTEGER, FK → warehouses.id), `quantity` (INTEGER), `employee_id` (INTEGER, FK → users.id), `created_at` (TIMESTAMP).

### 4.2. MongoDB
- **Collection `logs`**: Lưu lịch sử hành động (xuất/nhập kho, bán hàng, bảo hành, ca).
  - Cấu trúc: `{ _id: ObjectId, user_id: Number, action: String, details: Object, timestamp: ISODate }`.
  - Ví dụ: `{ action: "create_sale", details: { invoice_id: 123, total: 500000 }, timestamp: ISODate }`.

### 4.3. Redis
- **Session**: `session:<user_id>` → `{ token: String, expires_at: Number }`, TTL: 24 giờ.
- **Cache**:
  - `products:<warehouse_id>`: Danh sách sản phẩm và tồn kho (JSON).
  - `categories`: Danh sách danh mục.
  - TTL: 1 giờ, cập nhật khi dữ liệu thay đổi.

## 5. Tích Hợp Xác Thực/Phân Quyền
- **Vai trò**:
  - **Admin**: `manage_warehouse`, `manage_product`, `manage_customer`, `manage_partner`, `manage_invoice`, `manage_transaction`, `manage_warranty`, `view_report`, `manage_employee`.
  - **POS**: `manage_shift`, `create_sale`, `manage_warranty`.
- **Tự động load actions**:
  - Quét routes (`/warehouses`, `/products`, `/sales`) để tạo permissions (`view_warehouses`, `create_sale`).
  - Lưu vào PostgreSQL, gán cho roles qua giao diện admin.
- **Xác thực**:
  - Sử dụng JWT, kiểm tra session trong Redis.
  - Guard kiểm tra permissions cho mỗi API.

## 6. Tích Hợp Docker
- **Backend**: Thêm modules (`WarehouseModule`, `ProductModule`, `InvoiceModule`, v.v.) vào NestJS.
- **Frontend**: Thêm trang admin (`/admin/warehouses`, `/admin/products`) và POS (`/pos/sales`, `/pos/shifts`) với Tailwind CSS.
- **Docker Compose**: Tận dụng cấu hình hiện có, không cần container mới.

## 7. Báo Cáo (Admin)
- **Loại báo cáo**:
  - Doanh thu: Theo ngày, tuần, tháng, nhân viên, kho.
  - Tồn kho: Sản phẩm, kho, cảnh báo tồn thấp.
  - Công nợ: Khách hàng, đối tác.
  - Hiệu suất nhân viên: Doanh thu ca, số hóa đơn.
- **Triển khai**:
  - Backend: API `/reports` tổng hợp từ PostgreSQL, cache trong Redis.
  - Frontend: Hiển thị biểu đồ (Chart.js) và bảng, hỗ trợ tải PDF/Excel.

## 8. Lưu Ý Triển Khai
- **Bảo mật**:
  - Mã hóa mật khẩu (bcrypt).
  - Sử dụng HTTPS cho API.
  - Giới hạn quyền POS để tránh truy cập dữ liệu admin.
- **Hiệu suất**:
  - Cache sản phẩm/tồn kho trong Redis.
  - Dùng MongoDB để lưu logs, giảm tải cho PostgreSQL.
- **Mở rộng**:
  - Hỗ trợ thêm thanh toán (QR code, ví điện tử).
  - Sẵn sàng tích hợp API Gateway (Kong) nếu cần microservices.

## 9. Kết Luận
Hệ thống quản lý bán hàng tích hợp mượt mà với nền tảng base, hỗ trợ hai tầng Admin và POS. PostgreSQL đảm bảo dữ liệu có cấu trúc, MongoDB lưu logs, Redis tăng hiệu suất. RBAC và tự động load actions đảm bảo phân quyền chặt chẽ. Thiết kế linh hoạt, dễ mở rộng với microservices hoặc API Gateway trong tương lai.