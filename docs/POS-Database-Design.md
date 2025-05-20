# Chi Tiết Thiết Kế Cơ Sở Dữ Liệu Hệ Thống Quản Lý Bán Hàng

Tài liệu này mô tả chi tiết thiết kế cơ sở dữ liệu cho hệ thống quản lý bán hàng, triển khai trên PostgreSQL (dữ liệu cấu trúc), MongoDB (logs), và Redis (cache).

## 1. PostgreSQL Schema Design

### 1.1. Bảng Core (từ hệ thống xác thực)

#### `User`
Lưu thông tin người dùng (admin, nhân viên bán hàng)
- `id` (SERIAL, PK): ID duy nhất của user
- `email` (TEXT, UNIQUE): Email đăng nhập
- `password` (TEXT): Mật khẩu đã hash
- `name` (TEXT): Tên người dùng
- `phone` (TEXT): Số điện thoại liên hệ
- `status` (TEXT): Trạng thái ("active", "inactive")
- `createdAt` (TIMESTAMP): Thời điểm tạo
- `updatedAt` (TIMESTAMP): Thời điểm cập nhật

#### `Role`, `Permission`, `UserRole`, `RolePermission`
Các bảng này đã được định nghĩa trong hệ thống xác thực RBAC.

### 1.2. Bảng Warehouse (Kho Hàng)

#### `Warehouse`
- `id` (SERIAL, PK): ID duy nhất của kho
- `name` (TEXT): Tên kho
- `address` (TEXT): Địa chỉ kho
- `description` (TEXT): Mô tả
- `managerId` (INTEGER, FK → User.id): Người quản lý kho
- `status` (TEXT): Trạng thái kho ("active", "inactive")
- `createdAt` (TIMESTAMP): Thời điểm tạo
- `updatedAt` (TIMESTAMP): Thời điểm cập nhật

### 1.3. Bảng Product (Sản Phẩm)

#### `Category`
- `id` (SERIAL, PK): ID danh mục
- `name` (TEXT): Tên danh mục
- `description` (TEXT): Mô tả
- `parentId` (INTEGER, FK → Category.id, NULL): Danh mục cha (cho phép cấu trúc phân cấp)
- `createdAt` (TIMESTAMP): Thời điểm tạo
- `updatedAt` (TIMESTAMP): Thời điểm cập nhật

#### `Product`
- `id` (SERIAL, PK): ID sản phẩm
- `sku` (TEXT, UNIQUE): Mã sản phẩm
- `barcode` (TEXT): Mã vạch
- `name` (TEXT): Tên sản phẩm
- `description` (TEXT): Mô tả
- `categoryId` (INTEGER, FK → Category.id): Danh mục
- `costPrice` (DECIMAL): Giá nhập
- `sellingPrice` (DECIMAL): Giá bán
- `discountPrice` (DECIMAL): Giá khuyến mãi (NULL nếu không có)
- `unit` (TEXT): Đơn vị tính (cái, hộp, kg, v.v.)
- `taxRate` (DECIMAL): Thuế suất (%)
- `status` (TEXT): Trạng thái ("active", "inactive")
- `warrantyMonths` (INTEGER): Số tháng bảo hành
- `createdAt` (TIMESTAMP): Thời điểm tạo
- `updatedAt` (TIMESTAMP): Thời điểm cập nhật

#### `ProductAttribute`
- `id` (SERIAL, PK): ID thuộc tính
- `productId` (INTEGER, FK → Product.id): Sản phẩm
- `key` (TEXT): Tên thuộc tính (màu sắc, kích thước, v.v.)
- `value` (TEXT): Giá trị thuộc tính
- `createdAt` (TIMESTAMP): Thời điểm tạo

#### `ProductVariant`
- `id` (SERIAL, PK): ID biến thể
- `productId` (INTEGER, FK → Product.id): Sản phẩm gốc
- `sku` (TEXT, UNIQUE): Mã biến thể
- `barcode` (TEXT): Mã vạch biến thể
- `attributesJson` (JSONB): Tập hợp thuộc tính của biến thể (JSON)
- `costPrice` (DECIMAL): Giá nhập riêng của biến thể
- `sellingPrice` (DECIMAL): Giá bán riêng của biến thể
- `createdAt` (TIMESTAMP): Thời điểm tạo
- `updatedAt` (TIMESTAMP): Thời điểm cập nhật

#### `Inventory`
- `id` (SERIAL, PK): ID bản ghi tồn kho
- `warehouseId` (INTEGER, FK → Warehouse.id): Kho
- `productId` (INTEGER, FK → Product.id): Sản phẩm
- `variantId` (INTEGER, FK → ProductVariant.id, NULL): Biến thể sản phẩm (nếu có)
- `quantity` (INTEGER): Số lượng tồn kho
- `minQuantity` (INTEGER): Số lượng tối thiểu (cảnh báo tồn thấp)
- `lastStockTakeAt` (TIMESTAMP): Thời điểm kiểm kho gần nhất
- `updatedAt` (TIMESTAMP): Thời điểm cập nhật

### 1.4. Bảng Customer (Khách Hàng)

#### `Customer`
- `id` (SERIAL, PK): ID khách hàng
- `code` (TEXT): Mã khách hàng
- `name` (TEXT): Tên khách hàng
- `phone` (TEXT): Số điện thoại
- `email` (TEXT): Email
- `address` (TEXT): Địa chỉ
- `taxCode` (TEXT): Mã số thuế (cho doanh nghiệp)
- `type` (TEXT): Loại khách hàng ("retail", "wholesale")
- `birthdate` (DATE): Ngày sinh
- `points` (INTEGER): Điểm tích lũy
- `balanceDue` (DECIMAL): Công nợ
- `createdAt` (TIMESTAMP): Thời điểm tạo
- `updatedAt` (TIMESTAMP): Thời điểm cập nhật

### 1.5. Bảng Partner (Đối Tác)

#### `Partner`
- `id` (SERIAL, PK): ID đối tác
- `code` (TEXT): Mã đối tác
- `name` (TEXT): Tên đối tác
- `type` (TEXT): Loại đối tác ("supplier", "distributor")
- `contactName` (TEXT): Tên người liên hệ
- `contactPhone` (TEXT): Số điện thoại liên hệ
- `contactEmail` (TEXT): Email liên hệ
- `address` (TEXT): Địa chỉ
- `taxCode` (TEXT): Mã số thuế
- `balanceDue` (DECIMAL): Công nợ
- `terms` (TEXT): Điều khoản thanh toán
- `createdAt` (TIMESTAMP): Thời điểm tạo
- `updatedAt` (TIMESTAMP): Thời điểm cập nhật

### 1.6. Bảng Shift & Sales (Ca Làm Việc & Bán Hàng)

#### `Shift`
- `id` (SERIAL, PK): ID ca làm việc
- `userId` (INTEGER, FK → User.id): Nhân viên
- `warehouseId` (INTEGER, FK → Warehouse.id): Kho/Cửa hàng
- `startTime` (TIMESTAMP): Thời điểm bắt đầu ca
- `endTime` (TIMESTAMP, NULL): Thời điểm kết thúc ca
- `startCash` (DECIMAL): Tiền mặt ban đầu
- `endCash` (DECIMAL, NULL): Tiền mặt kết thúc
- `expectedCash` (DECIMAL, NULL): Tiền mặt dự kiến
- `cashDifference` (DECIMAL, NULL): Chênh lệch tiền mặt
- `note` (TEXT): Ghi chú
- `status` (TEXT): Trạng thái ("open", "closed")
- `createdAt` (TIMESTAMP): Thời điểm tạo
- `updatedAt` (TIMESTAMP): Thời điểm cập nhật

#### `Invoice`
- `id` (SERIAL, PK): ID hóa đơn
- `code` (TEXT, UNIQUE): Mã hóa đơn
- `shiftId` (INTEGER, FK → Shift.id): Ca làm việc
- `warehouseId` (INTEGER, FK → Warehouse.id): Kho/Cửa hàng
- `customerId` (INTEGER, FK → Customer.id, NULL): Khách hàng
- `userId` (INTEGER, FK → User.id): Nhân viên bán hàng
- `subtotal` (DECIMAL): Tổng tiền hàng
- `taxAmount` (DECIMAL): Tổng tiền thuế
- `discountAmount` (DECIMAL): Giảm giá
- `total` (DECIMAL): Tổng tiền hóa đơn
- `paidAmount` (DECIMAL): Số tiền đã thanh toán
- `changeAmount` (DECIMAL): Tiền thừa
- `paymentMethod` (TEXT): Phương thức thanh toán ("cash", "card", "transfer", "mixed")
- `paymentDetails` (JSONB): Chi tiết thanh toán (JSON)
- `status` (TEXT): Trạng thái ("draft", "completed", "cancelled")
- `note` (TEXT): Ghi chú
- `createdAt` (TIMESTAMP): Thời điểm tạo
- `updatedAt` (TIMESTAMP): Thời điểm cập nhật

#### `InvoiceItem`
- `id` (SERIAL, PK): ID mục hóa đơn
- `invoiceId` (INTEGER, FK → Invoice.id): Hóa đơn
- `productId` (INTEGER, FK → Product.id): Sản phẩm
- `variantId` (INTEGER, FK → ProductVariant.id, NULL): Biến thể sản phẩm
- `quantity` (DECIMAL): Số lượng
- `unitPrice` (DECIMAL): Đơn giá
- `originalPrice` (DECIMAL): Giá gốc (trước giảm giá)
- `discountAmount` (DECIMAL): Giảm giá trên một đơn vị
- `taxRate` (DECIMAL): Thuế suất (%)
- `taxAmount` (DECIMAL): Tiền thuế
- `subtotal` (DECIMAL): Thành tiền (unitPrice * quantity)
- `createdAt` (TIMESTAMP): Thời điểm tạo

### 1.7. Bảng Stock Transaction (Giao Dịch Kho)

#### `StockTransaction`
- `id` (SERIAL, PK): ID giao dịch kho
- `code` (TEXT, UNIQUE): Mã giao dịch
- `type` (TEXT): Loại giao dịch ("import", "export", "return", "adjustment")
- `warehouseFromId` (INTEGER, FK → Warehouse.id, NULL): Kho xuất (NULL nếu nhập từ NCC)
- `warehouseToId` (INTEGER, FK → Warehouse.id, NULL): Kho nhập (NULL nếu xuất cho khách)
- `partnerId` (INTEGER, FK → Partner.id, NULL): Đối tác (nếu nhập từ NCC)
- `invoiceId` (INTEGER, FK → Invoice.id, NULL): Hóa đơn liên quan (nếu xuất bán)
- `userId` (INTEGER, FK → User.id): Người thực hiện
- `totalValue` (DECIMAL): Tổng giá trị
- `status` (TEXT): Trạng thái ("draft", "completed", "cancelled")
- `note` (TEXT): Ghi chú
- `createdAt` (TIMESTAMP): Thời điểm tạo
- `updatedAt` (TIMESTAMP): Thời điểm cập nhật

#### `StockTransactionItem`
- `id` (SERIAL, PK): ID mục giao dịch
- `transactionId` (INTEGER, FK → StockTransaction.id): Giao dịch kho
- `productId` (INTEGER, FK → Product.id): Sản phẩm
- `variantId` (INTEGER, FK → ProductVariant.id, NULL): Biến thể sản phẩm
- `quantity` (DECIMAL): Số lượng
- `unitCost` (DECIMAL): Đơn giá
- `subtotal` (DECIMAL): Thành tiền (unitCost * quantity)
- `createdAt` (TIMESTAMP): Thời điểm tạo

### 1.8. Bảng Transaction (Giao Dịch Tài Chính)

#### `FinancialTransaction`
- `id` (SERIAL, PK): ID giao dịch
- `code` (TEXT, UNIQUE): Mã giao dịch
- `type` (TEXT): Loại giao dịch ("receipt", "payment")
- `amount` (DECIMAL): Số tiền
- `customerId` (INTEGER, FK → Customer.id, NULL): Khách hàng (nếu thu tiền khách)
- `partnerId` (INTEGER, FK → Partner.id, NULL): Đối tác (nếu trả tiền đối tác)
- `invoiceId` (INTEGER, FK → Invoice.id, NULL): Hóa đơn liên quan (nếu có)
- `userId` (INTEGER, FK → User.id): Người thực hiện
- `paymentMethod` (TEXT): Phương thức thanh toán
- `reference` (TEXT): Tham chiếu (số chuyển khoản, séc, v.v.)
- `note` (TEXT): Ghi chú
- `createdAt` (TIMESTAMP): Thời điểm tạo
- `updatedAt` (TIMESTAMP): Thời điểm cập nhật

### 1.9. Bảng Warranty (Bảo Hành)

#### `Warranty`
- `id` (SERIAL, PK): ID bảo hành
- `code` (TEXT, UNIQUE): Mã bảo hành
- `customerId` (INTEGER, FK → Customer.id): Khách hàng
- `invoiceId` (INTEGER, FK → Invoice.id): Hóa đơn gốc
- `productId` (INTEGER, FK → Product.id): Sản phẩm
- `variantId` (INTEGER, FK → ProductVariant.id, NULL): Biến thể sản phẩm
- `serialNumber` (TEXT): Số serial sản phẩm
- `issue` (TEXT): Vấn đề
- `solution` (TEXT): Phương án giải quyết
- `warrantyStart` (DATE): Ngày bắt đầu bảo hành
- `warrantyEnd` (DATE): Ngày kết thúc bảo hành
- `status` (TEXT): Trạng thái ("pending", "processing", "completed", "rejected")
- `receivedBy` (INTEGER, FK → User.id): Người tiếp nhận
- `resolvedBy` (INTEGER, FK → User.id, NULL): Người xử lý
- `note` (TEXT): Ghi chú
- `createdAt` (TIMESTAMP): Thời điểm tạo
- `updatedAt` (TIMESTAMP): Thời điểm cập nhật

## 2. MongoDB Collections Design

### 2.1. Collection `inventoryLogs`
Lưu trữ lịch sử thay đổi tồn kho:
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
  "type": String,  // "import", "export", "adjustment", "sale", "return"
  "reference": {
    "type": String,  // "invoice", "stock_transaction"
    "id": Number
  },
  "note": String
}
```

### 2.2. Collection `salesLogs`
Lưu trữ lịch sử bán hàng chi tiết:
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

### 2.3. Collection `warrantyLogs`
Lưu trữ lịch sử bảo hành:
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

### 2.4. Collection `activityLogs`
Lưu trữ hoạt động của người dùng:
```json
{
  "_id": ObjectId,
  "timestamp": ISODate,
  "userId": Number,
  "userName": String,
  "action": String,  // "login", "logout", "create", "update", "delete"
  "entity": String,  // "product", "customer", "invoice", etc.
  "entityId": Number,
  "details": Object,
  "ipAddress": String,
  "userAgent": String
}
```

## 3. Redis Cache Structure

### 3.1. Sessions và Tokens
- Key: `session:{userId}` (String)
- Value: JSON string chứa `{ token: <JWT>, expires: <timestamp> }`
- TTL: 24 giờ (hoặc tùy chỉnh)

### 3.2. Danh Sách Sản Phẩm
- Key: `products:all` (Hash)
- Field: `{productId}`
- Value: JSON string của thông tin sản phẩm
- TTL: 1 giờ

### 3.3. Tồn Kho Theo Kho
- Key: `inventory:{warehouseId}` (Hash)
- Field: `{productId}` hoặc `{productId}:{variantId}`
- Value: Số lượng tồn kho
- TTL: 30 phút

### 3.4. Top Sản Phẩm Bán Chạy
- Key: `products:bestsellers:{warehouseId}` (Sorted Set)
- Member: `{productId}`
- Score: Số lượng đã bán
- TTL: 24 giờ

### 3.5. Cache Chi Tiết Sản Phẩm
- Key: `product:{productId}` (Hash)
- Field: Các thuộc tính của sản phẩm
- Value: Giá trị tương ứng
- TTL: 1 giờ

### 3.6. Cache Quyền Người Dùng
- Key: `permissions:{userId}` (Set)
- Members: Danh sách các quyền (`action`)
- TTL: 1 giờ
