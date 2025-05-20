# Thiết Kế Hệ Thống Quản Lý Bán Hàng (Admin và POS)

Hệ thống quản lý bán hàng được xây dựng trên nền tảng base (NestJS, NextJS, PostgreSQL, MongoDB, Redis, Docker), hỗ trợ hai tầng người dùng: **Admin** (quản lý toàn diện) và **POS** (bán hàng, ca làm việc). Hệ thống tích hợp xác thực/phân quyền RBAC và tự động load actions từ API.

## 1. Tổng Quan Hệ Thống
- **Backend**: NestJS, cung cấp API cho quản lý kho, sản phẩm, khách hàng, đối tác, hóa đơn, phiếu thu/chi, bảo hành, báo cáo, nhân viên, ca làm việc, bán hàng.
- **Frontend**: NextJS với Tailwind CSS, cung cấp giao diện admin (quản lý) và POS (bán hàng, ca).
- **Cơ sở dữ liệu**:
  - **PostgreSQL**: Lưu trữ dữ liệu có cấu trúc (kho, sản phẩm, khách hàng, nhóm khách hàng, đối tác, hóa đơn, vị trí lưu trữ v.v.).
  - **MongoDB**: Lưu trữ logs (xuất/nhập kho, bán hàng, bảo hành) và dữ liệu phân tích nâng cao.
  - **Redis**: Quản lý session JWT, cache sản phẩm/tồn kho, và tối ưu hóa truy vấn báo cáo.
- **Triển khai**: Docker Compose, tận dụng cấu hình hiện có.
- **Xác thực/phân quyền**: RBAC với roles (`admin`, `pos`), tự động load actions từ API.

## 2. Chức Năng Chính

### 2.1. Tầng Admin
1. **Quản lý kho hàng**:
   - Tạo/sửa/xóa kho (tên, địa chỉ, người phụ trách).
   - Theo dõi tồn kho theo sản phẩm/kho.
   - Thực hiện xuất/nhập kho, cập nhật tồn kho, ghi log.
   - Xem lịch sử xuất/nhập kho.
   - Quản lý vị trí lưu trữ chi tiết (kệ, ngăn, khu vực).
2. **Quản lý sản phẩm**:
   - Thêm/sửa/xóa sản phẩm (mã, tên, danh mục, giá, thuộc tính: màu, kích thước).
   - Gán sản phẩm vào kho với số lượng tồn.
   - Gán vị trí lưu trữ cụ thể cho sản phẩm trong kho.
3. **Quản lý khách hàng**:
   - Lưu thông tin (tên, điện thoại, email, địa chỉ).
   - Theo dõi lịch sử mua hàng, công nợ.
   - Phân nhóm khách hàng (VIP, thành viên, khách lẻ, doanh nghiệp).
   - Thiết lập chính sách giá và khuyến mãi theo nhóm khách hàng.
4. **Quản lý đối tác**:
   - Lưu thông tin nhà cung cấp/khách buôn (tên, liên hệ, hợp đồng).
   - Quản lý công nợ (nợ phải trả/được thu).
5. **Quản lý hóa đơn**:
   - Tạo/xem/sửa/xóa hóa đơn bán hàng (liên kết khách hàng, kho).
   - Trạng thái: Đã thanh toán, đang chờ, hủy.
   - Áp dụng chính sách giá dựa trên nhóm khách hàng.
6. **Quản lý phiếu thu/chi**:
   - Tạo phiếu thu (thu tiền khách) hoặc phiếu chi (thanh toán đối tác).
   - Ghi nhận số tiền, ngày, mục đích.
7. **Quản lý bảo hành**:
   - Tạo/theo dõi yêu cầu bảo hành (sản phẩm, khách hàng, thời hạn).
   - Xem lịch sử bảo hành.
8. **Báo cáo và phân tích nâng cao**:
   - Doanh thu (ngày, tuần, tháng, nhân viên, kho).
   - Tồn kho (sản phẩm, kho, vị trí lưu trữ, cảnh báo tồn thấp).
   - Công nợ (khách hàng, đối tác).
   - Hiệu suất nhân viên (doanh thu ca, số hóa đơn).
   - Phân tích xu hướng bán hàng và dự báo nhu cầu.
   - Phân tích hiệu quả theo nhóm khách hàng.
   - Báo cáo tương tác đa chiều (cross-tabulation).
   - Trực quan hóa dữ liệu (biểu đồ, heatmap, dashboard).
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
   - Nhận dạng nhóm khách hàng và áp dụng chính sách giá tương ứng.
   - Gợi ý vị trí lấy hàng trong kho.
3. **Bảo hành**:
   - Kiểm tra trạng thái bảo hành (mã hóa đơn/sản phẩm).
   - Tạo yêu cầu bảo hành, gửi lên admin.

## 3. Luồng Thao Tác

### 3.1. Tầng Admin
1. **Quản lý kho hàng**:
   - Đăng nhập → Truy cập `/admin/warehouses`.
   - Tạo kho: Nhập tên, địa chỉ, người phụ trách.
   - Thiết lập cấu trúc vị trí lưu trữ: Thêm khu vực, kệ, ngăn trong kho.
   - Nhập/xuất kho: Chọn sản phẩm, số lượng, kho, vị trí → Cập nhật tồn kho, log vào MongoDB.
   - Xem lịch sử hoặc báo cáo tồn kho theo vị trí.
2. **Quản lý sản phẩm**:
   - Truy cập `/admin/products`, thêm/sửa sản phẩm (mã, tên, giá, danh mục, thuộc tính).
   - Gán sản phẩm vào kho và chỉ định vị trí lưu trữ cụ thể.
3. **Quản lý khách hàng/đối tác**:
   - Truy cập `/admin/customers` hoặc `/admin/partners`, thêm/sửa thông tin.
   - Truy cập `/admin/customer-groups`, tạo/quản lý nhóm khách hàng và thiết lập chính sách giá.
   - Gán khách hàng vào nhóm phù hợp.
   - Xem lịch sử mua hàng, công nợ.
4. **Quản lý hóa đơn/phiếu thu/chi**:
   - Truy cập `/admin/invoices`, tạo/xem hóa đơn.
   - Truy cập `/admin/transactions`, tạo phiếu thu/chi, cập nhật công nợ.
5. **Quản lý bảo hành**:
   - Truy cập `/admin/warranties`, tạo/xem yêu cầu bảo hành.
   - Cập nhật trạng thái (đang xử lý, hoàn thành).
6. **Báo cáo và phân tích**:
   - Truy cập `/admin/reports`, chọn loại báo cáo (doanh thu, tồn kho, công nợ).
   - Truy cập `/admin/analytics`, sử dụng các công cụ phân tích nâng cao:
     - Dashboard tổng quan theo thời gian thực.
     - Báo cáo theo nhóm khách hàng, hiệu quả bán hàng.
     - Dự báo tồn kho và nhu cầu mua sắm.
     - Phân tích xu hướng thị trường.
   - Tùy chỉnh báo cáo và xuất dữ liệu (PDF/Excel).
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
   - Nhập thông tin khách hàng, hệ thống tự động xác định nhóm và áp dụng chính sách giá.
   - Tạo hóa đơn: Thêm sản phẩm, khuyến mãi, thanh toán.
   - Nhận thông báo về vị trí lấy hàng trong kho.
   - Gửi hóa đơn: Cập nhật tồn kho, log vào MongoDB.
3. **Bảo hành**:
   - Truy cập `/pos/warranties`, kiểm tra bảo hành (mã hóa đơn/sản phẩm).
   - Tạo yêu cầu bảo hành, gửi lên admin.

## 4. Thiết Kế Database

### 4.1. PostgreSQL (Dữ liệu có cấu trúc)

#### Bảng `users`
- **Mô tả**: Lưu thông tin người dùng/nhân viên.
- **Cấu trúc**:
  ```sql
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### Bảng `roles` và `permissions`
- Kế thừa từ thiết kế base (RBAC).

#### Bảng `warehouses`
- **Mô tả**: Lưu thông tin kho hàng.
- **Cấu trúc**:
  ```sql
  CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    manager_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### Bảng `warehouse_locations`
- **Mô tả**: Lưu thông tin vị trí lưu trữ trong kho.
- **Cấu trúc**:
  ```sql
  CREATE TABLE warehouse_locations (
    id SERIAL PRIMARY KEY,
    warehouse_id INT REFERENCES warehouses(id),
    zone VARCHAR(50) NOT NULL,
    aisle VARCHAR(50) NOT NULL,
    rack VARCHAR(50) NOT NULL,
    shelf VARCHAR(50) NOT NULL,
    position VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'maintenance'
    max_capacity DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(warehouse_id, zone, aisle, rack, shelf, position)
  );
  ```

#### Bảng `product_categories`
- **Mô tả**: Danh mục sản phẩm.
- **Cấu trúc**:
  ```sql
  CREATE TABLE product_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id INT REFERENCES product_categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### Bảng `products`
- **Mô tả**: Lưu thông tin sản phẩm.
- **Cấu trúc**:
  ```sql
  CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT REFERENCES product_categories(id),
    base_price DECIMAL(15, 2) NOT NULL,
    cost_price DECIMAL(15, 2),
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    barcode VARCHAR(100),
    unit VARCHAR(50),
    manufacturer VARCHAR(255),
    warranty_months INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### Bảng `product_attributes`
- **Mô tả**: Lưu thuộc tính sản phẩm (màu, kích thước).
- **Cấu trúc**:
  ```sql
  CREATE TABLE product_attributes (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    attribute_name VARCHAR(100) NOT NULL,
    attribute_value VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### Bảng `inventory`
- **Mô tả**: Lưu trữ thông tin tồn kho.
- **Cấu trúc**:
  ```sql
  CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    warehouse_id INT REFERENCES warehouses(id),
    location_id INT REFERENCES warehouse_locations(id),
    quantity DECIMAL(10, 2) DEFAULT 0,
    min_stock_level DECIMAL(10, 2) DEFAULT 0,
    max_stock_level DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, warehouse_id, location_id)
  );
  ```

#### Bảng `inventory_transactions`
- **Mô tả**: Lưu trữ lịch sử xuất/nhập kho.
- **Cấu trúc**:
  ```sql
  CREATE TABLE inventory_transactions (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    warehouse_id INT REFERENCES warehouses(id),
    location_id INT REFERENCES warehouse_locations(id),
    transaction_type VARCHAR(20) NOT NULL, -- 'in', 'out', 'transfer', 'adjustment'
    quantity DECIMAL(10, 2) NOT NULL,
    reference_type VARCHAR(50), -- 'order', 'return', 'internal', etc.
    reference_id INT,
    user_id INT REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### Bảng `customer_groups`
- **Mô tả**: Nhóm khách hàng.
- **Cấu trúc**:
  ```sql
  CREATE TABLE customer_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_rate DECIMAL(5, 2) DEFAULT 0,
    credit_limit DECIMAL(15, 2),
    payment_terms INT, -- Số ngày được phép trả chậm
    priority INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### Bảng `customers`
- **Mô tả**: Lưu thông tin khách hàng.
- **Cấu trúc**:
  ```sql
  CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    tax_code VARCHAR(50),
    group_id INT REFERENCES customer_groups(id),
    credit_balance DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### Bảng `partners`
- **Mô tả**: Lưu thông tin đối tác/nhà cung cấp.
- **Cấu trúc**:
  ```sql
  CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    tax_code VARCHAR(50),
    payment_terms INT, -- Số ngày trả chậm mặc định
    credit_balance DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### Bảng `shifts`
- **Mô tả**: Lưu thông tin ca làm việc.
- **Cấu trúc**:
  ```sql
  CREATE TABLE shifts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    warehouse_id INT REFERENCES warehouses(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    start_amount DECIMAL(15, 2) NOT NULL,
    end_amount DECIMAL(15, 2),
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'closed'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### Bảng `invoices`
- **Mô tả**: Lưu thông tin hóa đơn bán hàng.
- **Cấu trúc**:
  ```sql
  CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    customer_id INT REFERENCES customers(id),
    user_id INT REFERENCES users(id),
    shift_id INT REFERENCES shifts(id),
    warehouse_id INT REFERENCES warehouses(id),
    invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(15, 2) NOT NULL,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL,
    paid_amount DECIMAL(15, 2) DEFAULT 0,
    payment_method VARCHAR(50), -- 'cash', 'card', 'bank_transfer', etc.
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'canceled'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### Bảng `invoice_items`
- **Mô tả**: Lưu chi tiết sản phẩm trong hóa đơn.
- **Cấu trúc**:
  ```sql
  CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(id),
    product_id INT REFERENCES products(id),
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    discount_rate DECIMAL(5, 2) DEFAULT 0,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL,
    location_id INT REFERENCES warehouse_locations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### Bảng `price_lists`
- **Mô tả**: Bảng giá tùy chỉnh theo nhóm khách hàng.
- **Cấu trúc**:
  ```sql
  CREATE TABLE price_lists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    customer_group_id INT REFERENCES customer_groups(id),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### Bảng `price_list_items`
- **Mô tả**: Chi tiết giá sản phẩm trong bảng giá.
- **Cấu trúc**:
  ```sql
  CREATE TABLE price_list_items (
    id SERIAL PRIMARY KEY,
    price_list_id INT REFERENCES price_lists(id),
    product_id INT REFERENCES products(id),
    price DECIMAL(15, 2) NOT NULL,
    min_quantity DECIMAL(10, 2) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(price_list_id, product_id, min_quantity)
  );
  ```

#### Bảng `transactions`
- **Mô tả**: Lưu phiếu thu/chi.
- **Cấu trúc**:
  ```sql
  CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'receipt', 'payment'
    amount DECIMAL(15, 2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_id INT REFERENCES customers(id),
    partner_id INT REFERENCES partners(id),
    invoice_id INT REFERENCES invoices(id),
    user_id INT REFERENCES users(id),
    shift_id INT REFERENCES shifts(id),
    payment_method VARCHAR(50), -- 'cash', 'bank_transfer', etc.
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### Bảng `warranties`
- **Mô tả**: Lưu yêu cầu bảo hành.
- **Cấu trúc**:
  ```sql
  CREATE TABLE warranties (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    customer_id INT REFERENCES customers(id),
    product_id INT REFERENCES products(id),
    invoice_id INT REFERENCES invoices(id),
    issue_description TEXT,
    received_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_return_date TIMESTAMP,
    actual_return_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'rejected'
    notes TEXT,
    user_id INT REFERENCES users(id), -- Người tạo yêu cầu
    technician_id INT REFERENCES users(id), -- Người xử lý
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### Bảng `report_templates`
- **Mô tả**: Mẫu báo cáo tùy chỉnh.
- **Cấu trúc**:
  ```sql
  CREATE TABLE report_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(100) NOT NULL, -- 'sales', 'inventory', 'financial', etc.
    query_template TEXT NOT NULL,
    parameters JSONB,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

### 4.2. MongoDB (Logs và phân tích)

#### Collection `logs`
- **Mô tả**: Lưu logs hành động.
- **Cấu trúc mẫu**:
  ```json
  {
    "_id": "ObjectId",
    "action": "String", // "login", "create_invoice", "inventory_update", etc.
    "user_id": "Number",
    "details": "Object", // Chi tiết hành động
    "timestamp": "ISODate"
  }
  ```

#### Collection `inventory_logs`
- **Mô tả**: Lưu log xuất/nhập kho chi tiết.
- **Cấu trúc mẫu**:
  ```json
  {
    "_id": "ObjectId",
    "transaction_id": "Number",
    "product_id": "Number",
    "warehouse_id": "Number",
    "location_id": "Number",
    "old_quantity": "Number",
    "new_quantity": "Number",
    "change": "Number",
    "user_id": "Number",
    "notes": "String",
    "timestamp": "ISODate"
  }
  ```

#### Collection `sales_analytics`
- **Mô tả**: Dữ liệu phân tích bán hàng.
- **Cấu trúc mẫu**:
  ```json
  {
    "_id": "ObjectId",
    "date": "ISODate",
    "product_id": "Number",
    "category_id": "Number",
    "warehouse_id": "Number",
    "customer_id": "Number",
    "customer_group_id": "Number",
    "quantity": "Number",
    "revenue": "Number",
    "cost": "Number",
    "profit": "Number",
    "discount": "Number",
    "metadata": "Object" // Thông tin phân tích bổ sung
  }
  ```

#### Collection `analytics_reports`
- **Mô tả**: Kết quả báo cáo phân tích nâng cao.
- **Cấu trúc mẫu**:
  ```json
  {
    "_id": "ObjectId",
    "report_id": "String",
    "report_name": "String",
    "generated_at": "ISODate",
    "user_id": "Number",
    "parameters": "Object",
    "results": "Array",
    "aggregation_pipeline": "Array", // Lưu MongoDB aggregation pipeline
    "visualization_config": "Object" // Cấu hình hiển thị
  }
  ```

#### Collection `forecasting_models`
- **Mô tả**: Mô hình dự báo tồn kho và nhu cầu.
- **Cấu trúc mẫu**:
  ```json
  {
    "_id": "ObjectId",
    "model_type": "String", // "time_series", "regression", etc.
    "product_id": "Number",
    "category_id": "Number",
    "parameters": "Object",
    "training_data": "Object",
    "last_updated": "ISODate",
    "forecast_results": "Array",
    "accuracy_metrics": "Object"
  }
  ```

### 4.3. Redis (Cache và Session)

#### Key Pattern `session:<user_id>`
- **Mô tả**: Lưu JWT session.
- **Giá trị**: JSON chứa `{ token, expires_at }`.
- **TTL**: 24 giờ.

#### Key Pattern `product:inventory:<product_id>:<warehouse_id>`
- **Mô tả**: Cache tồn kho sản phẩm.
- **Giá trị**: `{ quantity, locations: [{ id, quantity }] }`.
- **TTL**: 30 phút.

#### Key Pattern `price_list:<customer_group_id>:<product_id>`
- **Mô tả**: Cache giá sản phẩm theo nhóm khách hàng.
- **Giá trị**: `{ price, discount_rate }`.
- **TTL**: 60 phút.

#### Key Pattern `report:cache:<report_id>:<params_hash>`
- **Mô tả**: Cache kết quả báo cáo.
- **Giá trị**: JSON chứa kết quả báo cáo.
- **TTL**: 15 phút.

## 5. Luồng API

### 5.1. API Quản lý kho và vị trí lưu trữ
```
# Kho hàng
GET /api/warehouses - Lấy danh sách kho
POST /api/warehouses - Tạo kho mới
GET /api/warehouses/:id - Lấy thông tin kho
PUT /api/warehouses/:id - Cập nhật thông tin kho
DELETE /api/warehouses/:id - Xóa kho

# Vị trí lưu trữ
GET /api/warehouses/:id/locations - Lấy danh sách vị trí trong kho
POST /api/warehouse-locations - Tạo vị trí mới
GET /api/warehouse-locations/:id - Lấy thông tin vị trí
PUT /api/warehouse-locations/:id - Cập nhật thông tin vị trí
DELETE /api/warehouse-locations/:id - Xóa vị trí
```

### 5.2. API Quản lý nhóm khách hàng
```
GET /api/customer-groups - Lấy danh sách nhóm
POST /api/customer-groups - Tạo nhóm mới
GET /api/customer-groups/:id - Lấy thông tin nhóm
PUT /api/customer-groups/:id - Cập nhật thông tin nhóm
DELETE /api/customer-groups/:id - Xóa nhóm
GET /api/customers/group/:group_id - Lấy danh sách khách hàng theo nhóm
POST /api/price-lists - Tạo bảng giá theo nhóm
```

### 5.3. API Báo cáo và phân tích nâng cao
```
GET /api/reports/templates - Lấy danh sách mẫu báo cáo
POST /api/reports/templates - Tạo mẫu báo cáo mới
GET /api/reports/generate - Tạo báo cáo từ mẫu và tham số
GET /api/analytics/dashboard - Lấy dữ liệu cho dashboard tổng quan
GET /api/analytics/sales/trend - Phân tích xu hướng bán hàng
GET /api/analytics/inventory/forecast - Dự báo tồn kho
GET /api/analytics/customer-groups/performance - Phân tích hiệu quả theo nhóm khách hàng
POST /api/analytics/custom - Tạo báo cáo phân tích tùy chỉnh
```

## 6. Lưu Ý Triển Khai

1. **Bảo mật**:
   - Mã hóa dữ liệu nhạy cảm (JWT, password với bcrypt).
   - Kiểm soát truy cập API thông qua RBAC.
   - Lưu log mọi hành động quan trọng (MongoDB).

2. **Hiệu suất**:
   - Cache dữ liệu thường dùng trong Redis (tồn kho, giá).
   - Phân trang kết quả API để tối ưu tải.
   - Sử dụng MongoDB cho phân tích dữ liệu lớn.

3. **Tính mở rộng**:
   - Thiết kế module cho các tính năng mới (vị trí lưu trữ, nhóm khách hàng, báo cáo nâng cao).
   - Tách phần phân tích thành microservice riêng nếu cần.

4. **Docker**:
   - Định cấu hình volume để lưu dữ liệu PostgreSQL/MongoDB/Redis.
   - Cập nhật docker-compose.yml để hỗ trợ xây dựng và chạy service mới.

## 7. Kế hoạch Triển Khai

1. **Phase 1: Thiết lập cơ sở dữ liệu**
   - Cập nhật schema PostgreSQL (thêm bảng vị trí kho, nhóm khách hàng).
   - Tạo collection mới trong MongoDB cho phân tích nâng cao.
   - Thiết lập pattern key Redis cho cache báo cáo.

2. **Phase 2: Phát triển backend**
   - Tạo module và service mới (WarehouseLocationsModule, CustomerGroupsModule, AdvancedReportingModule).
   - Phát triển API endpoint cho các tính năng mới.
   - Tích hợp với hệ thống phân quyền RBAC hiện có.

3. **Phase 3: Phát triển frontend**
   - Tạo trang quản lý vị trí kho (/admin/warehouse-locations).
   - Tạo trang quản lý nhóm khách hàng (/admin/customer-groups).
   - Tạo trang báo cáo và phân tích nâng cao (/admin/analytics).
   - Cập nhật trang POS để hỗ trợ các tính năng mới.

4. **Phase 4: Kiểm thử và triển khai**
   - Kiểm thử đơn vị (unit test) và tích hợp (integration test).
   - Triển khai phiên bản beta, thu thập phản hồi.
   - Triển khai production với Docker Compose.

