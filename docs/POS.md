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

## 4. Thiết Kế Cơ Sở Dữ Liệu

### 4.1. PostgreSQL Schema

#### 4.1.1. User & Permissions (từ RBAC)
- **User**: Thông tin người dùng (id, email, password, name, phone, status, createdAt, updatedAt)
- **Role**: Vai trò người dùng (id, name, description, createdAt)
- **Permission**: Quyền hạn (id, action, description, createdAt)
- **UserRole**: Liên kết User-Role (userId, roleId)
- **RolePermission**: Liên kết Role-Permission (roleId, permissionId)

#### 4.1.2. Warehouse & Inventory
- **Warehouse**: Thông tin kho (id, name, address, description, managerId, status, createdAt, updatedAt)
- **Category**: Danh mục sản phẩm (id, name, description, parentId, createdAt, updatedAt)
- **Product**: Sản phẩm (id, sku, barcode, name, description, categoryId, costPrice, sellingPrice, discountPrice, unit, taxRate, status, warrantyMonths, createdAt, updatedAt)
- **ProductAttribute**: Thuộc tính sản phẩm (id, productId, key, value, createdAt)
- **ProductVariant**: Biến thể sản phẩm (id, productId, sku, barcode, attributesJson, costPrice, sellingPrice, createdAt, updatedAt)
- **Inventory**: Tồn kho (id, warehouseId, productId, variantId, quantity, minQuantity, lastStockTakeAt, updatedAt)

#### 4.1.3. Customer & Partner
- **Customer**: Khách hàng (id, code, name, phone, email, address, taxCode, type, birthdate, points, balanceDue, createdAt, updatedAt)
- **Partner**: Đối tác (id, code, name, type, contactName, contactPhone, contactEmail, address, taxCode, balanceDue, terms, createdAt, updatedAt)

#### 4.1.4. Sales & Transaction
- **Shift**: Ca làm việc (id, userId, warehouseId, startTime, endTime, startCash, endCash, expectedCash, cashDifference, note, status, createdAt, updatedAt)
- **Invoice**: Hóa đơn (id, code, shiftId, warehouseId, customerId, userId, subtotal, taxAmount, discountAmount, total, paidAmount, changeAmount, paymentMethod, paymentDetails, status, note, createdAt, updatedAt)
- **InvoiceItem**: Chi tiết hóa đơn (id, invoiceId, productId, variantId, quantity, unitPrice, originalPrice, discountAmount, taxRate, taxAmount, subtotal, createdAt)
- **StockTransaction**: Giao dịch kho (id, code, type, warehouseFromId, warehouseToId, partnerId, invoiceId, userId, totalValue, status, note, createdAt, updatedAt)
- **StockTransactionItem**: Chi tiết giao dịch kho (id, transactionId, productId, variantId, quantity, unitCost, subtotal, createdAt)
- **FinancialTransaction**: Giao dịch tài chính (id, code, type, amount, customerId, partnerId, invoiceId, userId, paymentMethod, reference, note, createdAt, updatedAt)
- **Warranty**: Bảo hành (id, code, customerId, invoiceId, productId, variantId, serialNumber, issue, solution, warrantyStart, warrantyEnd, status, receivedById, resolvedById, note, createdAt, updatedAt)

### 4.2. MongoDB Collections

#### 4.2.1. inventoryLogs
```json
{
  "_id": ObjectId,
  "timestamp": ISODate,
  "warehouseId": Number,
  "productId": Number,
  "variantId": Number,
  "quantityBefore": Number,
  "quantityAfter": Number,
  "differenceQuantity": Number,
  "transactionId": Number,
  "userId": Number,
  "type": String,
  "reference": {
    "type": String,
    "id": Number
  },
  "note": String
}
```

#### 4.2.2. salesLogs
```json
{
  "_id": ObjectId,
  "timestamp": ISODate,
  "invoiceId": Number,
  "invoiceCode": String,
  "shiftId": Number,
  "userId": Number,
  "userName": String,
  "warehouseId": Number,
  "warehouseName": String,
  "customerId": Number,
  "customerName": String,
  "items": [
    {
      "productId": Number,
      "productName": String,
      "variantId": Number,
      "variantAttributes": Object,
      "quantity": Number,
      "unitPrice": Number,
      "subtotal": Number
    }
  ],
  "subtotal": Number,
  "taxAmount": Number,
  "discountAmount": Number,
  "total": Number,
  "paymentMethod": String,
  "status": String
}
```

#### 4.2.3. warrantyLogs
```json
{
  "_id": ObjectId,
  "timestamp": ISODate,
  "warrantyId": Number,
  "warrantyCode": String,
  "customerId": Number,
  "customerName": String,
  "productId": Number,
  "productName": String,
  "serialNumber": String,
  "status": String,
  "issue": String,
  "solution": String,
  "receivedBy": {
    "userId": Number,
    "userName": String
  },
  "resolvedBy": {
    "userId": Number,
    "userName": String
  },
  "note": String
}
```

#### 4.2.4. activityLogs
```json
{
  "_id": ObjectId,
  "timestamp": ISODate,
  "userId": Number,
  "userName": String,
  "action": String,
  "entity": String,
  "entityId": Number,
  "details": Object,
  "ipAddress": String,
  "userAgent": String
}
```

### 4.3. Redis Cache

#### 4.3.1. Sessions và Tokens
- Key: `session:{userId}` (String)
- Value: JSON chứa `{ token: <JWT>, expires: <timestamp> }`
- TTL: 24 giờ

#### 4.3.2. Cache Sản Phẩm và Tồn Kho
- Products: `products:all` (Hash), `product:{productId}` (Hash)
- Inventory: `inventory:{warehouseId}` (Hash)
- Top Sellers: `products:bestsellers:{warehouseId}` (Sorted Set)

## 5. Triển Khai Công Nghệ

### 5.1. Prisma ORM
- Schema định nghĩa trong `schema.prisma` với đầy đủ models và relations
- Middleware để tự động cập nhật trường `updatedAt`
- Migrations tự động tạo và cập nhật database schema

### 5.2. MongoDB Integration
- Sử dụng `@nestjs/mongoose` để định nghĩa schemas
- Service chuyên biệt để ghi logs vào MongoDB
- Middleware tự động ghi log mỗi khi có thao tác inventory/sales

### 5.3. Redis Cache
- Sử dụng `ioredis` để tương tác với Redis
- Cache sản phẩm và tồn kho để tăng hiệu suất POS
- Tự động invalidate cache khi có thay đổi dữ liệu

### 5.4. Docker và Containerization
- Các services được đóng gói trong containers
- Docker Compose để khởi chạy toàn bộ stack
- Volume để lưu trữ dữ liệu bền vững

## 6. Những Lưu Ý Triển Khai

### 6.1. Hiệu Suất
- Index phù hợp cho các trường thường được query
- Cache Redis cho dữ liệu thường xuyên đọc
- MongoDB để lưu logs thay vì PostgreSQL
- Phân trang kết quả truy vấn lớn

### 6.2. Bảo Mật
- Hash password với bcrypt
- JWT rotation và invalidation
- Phân quyền chi tiết với RBAC
- HTTPS cho tất cả kết nối

### 6.3. Backup và DR
- Backup PostgreSQL định kỳ
- Replication MongoDB
- Redis persistence
- Chiến lược khôi phục sau sự cố

### 6.4. Khả Năng Mở Rộng
- Microservices architecture
- Horizontal scaling cho các services
- Database sharding nếu cần

