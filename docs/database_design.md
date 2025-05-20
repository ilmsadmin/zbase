# Thiết Kế Database Chi Tiết cho Hệ Thống Quản Lý Bán Hàng

## 1. Tổng Quan Kiến Trúc Database

Hệ thống quản lý bán hàng sử dụng kiến trúc đa database, kết hợp cả SQL và NoSQL, cùng với hệ thống cache để tối ưu hiệu suất:

1. **PostgreSQL**: Lưu trữ dữ liệu có cấu trúc với tính toàn vẹn cao
2. **MongoDB**: Lưu trữ logs và dữ liệu phân tích không cấu trúc
3. **Redis**: Cache dữ liệu và quản lý session

### 1.1 Quan Hệ giữa Các Cơ Sở Dữ Liệu

- **PostgreSQL**: Là database chính, lưu trữ toàn bộ dữ liệu giao dịch, users, roles, products, kho hàng, vị trí lưu trữ, nhóm khách hàng, v.v.
- **MongoDB**: Lưu trữ logs và dữ liệu phân tích để không ảnh hưởng đến hiệu suất của PostgreSQL
- **Redis**: Cache dữ liệu thường xuyên truy cập như thông tin sản phẩm, giá cả, tồn kho, kết quả báo cáo

## 2. PostgreSQL & Prisma ORM

### 2.1 Sơ Đồ Quan Hệ (Entity-Relationship Diagram)

```
User 1--* Warehouse (manager)
User 1--* Invoice 
User 1--* Warranty
User 1--* Transaction
User 1--* Shift
User *--* Role (via RolePermission)
Role *--* Permission (via RolePermission)

Warehouse 1--* WarehouseLocation
Warehouse 1--* Inventory
Warehouse 1--* InventoryTransaction
Warehouse 1--* Invoice
Warehouse 1--* Shift

WarehouseLocation 1--* Inventory
WarehouseLocation 1--* InventoryTransaction
WarehouseLocation 1--* InvoiceItem

ProductCategory 1--* Product
ProductCategory 1--* ProductCategory (hierarchical)

Product 1--* ProductAttribute
Product 1--* Inventory
Product 1--* InventoryTransaction
Product 1--* InvoiceItem
Product 1--* PriceListItem
Product 1--* Warranty

CustomerGroup 1--* Customer
CustomerGroup 1--* PriceList

Customer 1--* Invoice
Customer 1--* Transaction
Customer 1--* Warranty

Partner 1--* Transaction

Shift 1--* Invoice
Shift 1--* Transaction

Invoice 1--* InvoiceItem
Invoice 1--* Transaction
Invoice 1--* Warranty

PriceList 1--* PriceListItem
```

### 2.2 Chi Tiết Bảng và Trường Dữ Liệu

#### 2.2.1 Bảng Core Auth

```prisma
// Users, Roles, Permissions
model User {
  id                Int                @id @default(autoincrement())
  email             String             @unique
  password          String
  name              String
  role              Role?              @relation(fields: [roleId], references: [id])
  roleId            Int?
  managedWarehouses Warehouse[]        @relation("WarehouseManager")
  invoices          Invoice[]
  shifts            Shift[]
  createdWarranties Warranty[]         @relation("WarrantyCreator")
  handledWarranties Warranty[]         @relation("WarrantyTechnician")
  transactions      Transaction[]
  reportTemplates   ReportTemplate[]
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
}

model Role {
  id            Int               @id @default(autoincrement())
  name          String            @unique
  description   String?
  users         User[]
  rolePermissions RolePermission[]
  createdAt     DateTime          @default(now())
}

model Permission {
  id              Int               @id @default(autoincrement())
  action          String            @unique
  description     String?
  rolePermissions RolePermission[]
  createdAt       DateTime          @default(now())
}

model RolePermission {
  id           Int        @id @default(autoincrement())
  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  roleId       Int
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  permissionId Int
  createdAt    DateTime   @default(now())

  @@unique([roleId, permissionId])
}
```

#### 2.2.2 Bảng Kho và Vị Trí Lưu Trữ

```prisma
// Warehouses and Location management
model Warehouse {
  id                 Int                  @id @default(autoincrement())
  name               String
  address            String?
  manager            User?                @relation("WarehouseManager", fields: [managerId], references: [id])
  managerId          Int?
  locations          WarehouseLocation[]
  inventory          Inventory[]
  inventoryTransactions InventoryTransaction[]
  invoices           Invoice[]
  shifts             Shift[]
  createdAt          DateTime             @default(now())
  updatedAt          DateTime             @updatedAt
}

model WarehouseLocation {
  id             Int                   @id @default(autoincrement())
  warehouse      Warehouse             @relation(fields: [warehouseId], references: [id], onDelete: Cascade)
  warehouseId    Int
  zone           String                // Khu vực trong kho
  aisle          String                // Dãy kệ
  rack           String                // Kệ
  shelf          String                // Ngăn
  position       String                // Vị trí
  description    String?
  status         String                @default("active") // 'active', 'inactive', 'maintenance'
  maxCapacity    Decimal?              @db.Decimal(10, 2)
  inventory      Inventory[]
  inventoryTransactions InventoryTransaction[]
  invoiceItems   InvoiceItem[]
  createdAt      DateTime              @default(now())
  updatedAt      DateTime              @updatedAt

  @@unique([warehouseId, zone, aisle, rack, shelf, position])
}
```

#### 2.2.3 Bảng Sản Phẩm và Danh Mục

```prisma
// Products and Categories
model ProductCategory {
  id          Int              @id @default(autoincrement())
  name        String
  parent      ProductCategory? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  parentId    Int?
  children    ProductCategory[] @relation("CategoryHierarchy")
  products    Product[]
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}

model Product {
  id               Int                  @id @default(autoincrement())
  code             String               @unique
  name             String
  description      String?
  category         ProductCategory?     @relation(fields: [categoryId], references: [id])
  categoryId       Int?
  basePrice        Decimal              @db.Decimal(15, 2)
  costPrice        Decimal?             @db.Decimal(15, 2)
  taxRate          Decimal              @default(0) @db.Decimal(5, 2)
  barcode          String?
  unit             String?
  manufacturer     String?
  warrantyMonths   Int                  @default(0)
  attributes       ProductAttribute[]
  inventory        Inventory[]
  inventoryTransactions InventoryTransaction[]
  invoiceItems     InvoiceItem[]
  priceListItems   PriceListItem[]
  warranties       Warranty[]
  createdAt        DateTime             @default(now())
  updatedAt        DateTime             @updatedAt
}

model ProductAttribute {
  id             Int      @id @default(autoincrement())
  product        Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId      Int
  attributeName  String
  attributeValue String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([productId])
}
```

#### 2.2.4 Bảng Nhóm Khách Hàng và Quản Lý Giá

```prisma
// Customer Groups and Price Management
model CustomerGroup {
  id           Int          @id @default(autoincrement())
  name         String
  description  String?
  discountRate Decimal      @default(0) @db.Decimal(5, 2)
  creditLimit  Decimal?     @db.Decimal(15, 2)
  paymentTerms Int?         // Số ngày được phép trả chậm
  priority     Int          @default(0)
  customers    Customer[]
  priceLists   PriceList[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

model Customer {
  id            Int           @id @default(autoincrement())
  code          String?       @unique
  name          String
  phone         String?
  email         String?
  address       String?
  taxCode       String?
  group         CustomerGroup? @relation(fields: [groupId], references: [id])
  groupId       Int?
  creditBalance Decimal       @default(0) @db.Decimal(15, 2)
  invoices      Invoice[]
  transactions  Transaction[]
  warranties    Warranty[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model PriceList {
  id               Int               @id @default(autoincrement())
  name             String
  description      String?
  customerGroup    CustomerGroup     @relation(fields: [customerGroupId], references: [id])
  customerGroupId  Int
  startDate        DateTime?
  endDate          DateTime?
  status           String            @default("active") // 'active', 'inactive'
  items            PriceListItem[]
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
}

model PriceListItem {
  id           Int       @id @default(autoincrement())
  priceList    PriceList @relation(fields: [priceListId], references: [id], onDelete: Cascade)
  priceListId  Int
  product      Product   @relation(fields: [productId], references: [id])
  productId    Int
  price        Decimal   @db.Decimal(15, 2)
  minQuantity  Decimal   @default(1) @db.Decimal(10, 2)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@unique([priceListId, productId, minQuantity])
  @@index([productId])
}
```

#### 2.2.5 Bảng Tồn Kho và Giao Dịch Kho

```prisma
// Inventory Management
model Inventory {
  id            Int               @id @default(autoincrement())
  product       Product           @relation(fields: [productId], references: [id])
  productId     Int
  warehouse     Warehouse         @relation(fields: [warehouseId], references: [id])
  warehouseId   Int
  location      WarehouseLocation? @relation(fields: [locationId], references: [id])
  locationId    Int?
  quantity      Decimal           @default(0) @db.Decimal(10, 2)
  minStockLevel Decimal           @default(0) @db.Decimal(10, 2)
  maxStockLevel Decimal?          @db.Decimal(10, 2)
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  @@unique([productId, warehouseId, locationId])
  @@index([warehouseId])
  @@index([productId])
}

model InventoryTransaction {
  id              Int               @id @default(autoincrement())
  product         Product           @relation(fields: [productId], references: [id])
  productId       Int
  warehouse       Warehouse         @relation(fields: [warehouseId], references: [id])
  warehouseId     Int
  location        WarehouseLocation? @relation(fields: [locationId], references: [id])
  locationId      Int?
  transactionType String           // 'in', 'out', 'transfer', 'adjustment'
  quantity        Decimal           @db.Decimal(10, 2)
  referenceType   String?          // 'order', 'return', 'internal', etc.
  referenceId     Int?
  user            User?             @relation(fields: [userId], references: [id])
  userId          Int?
  notes           String?
  createdAt       DateTime          @default(now())

  @@index([productId])
  @@index([warehouseId])
  @@index([referenceType, referenceId])
}
```

#### 2.2.6 Bảng Đối Tác và Giao Dịch

```prisma
// Partners and Transactions
model Partner {
  id            Int           @id @default(autoincrement())
  code          String?       @unique
  name          String
  contactPerson String?
  phone         String?
  email         String?
  address       String?
  taxCode       String?
  paymentTerms  Int?          // Số ngày trả chậm mặc định
  creditBalance Decimal       @default(0) @db.Decimal(15, 2)
  transactions  Transaction[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model Transaction {
  id              Int       @id @default(autoincrement())
  code            String    @unique
  transactionType String    // 'receipt', 'payment'
  amount          Decimal   @db.Decimal(15, 2)
  transactionDate DateTime  @default(now())
  customer        Customer? @relation(fields: [customerId], references: [id])
  customerId      Int?
  partner         Partner?  @relation(fields: [partnerId], references: [id])
  partnerId       Int?
  invoice         Invoice?  @relation(fields: [invoiceId], references: [id])
  invoiceId       Int?
  user            User      @relation(fields: [userId], references: [id])
  userId          Int
  shift           Shift?    @relation(fields: [shiftId], references: [id])
  shiftId         Int?
  paymentMethod   String?   // 'cash', 'bank_transfer', etc.
  notes           String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([customerId])
  @@index([partnerId])
  @@index([invoiceId])
  @@index([userId])
  @@index([shiftId])
}
```

#### 2.2.7 Bảng Ca Làm Việc và Hóa Đơn

```prisma
// Shifts and Sales
model Shift {
  id          Int           @id @default(autoincrement())
  user        User          @relation(fields: [userId], references: [id])
  userId      Int
  warehouse   Warehouse     @relation(fields: [warehouseId], references: [id])
  warehouseId Int
  startTime   DateTime
  endTime     DateTime?
  startAmount Decimal       @db.Decimal(15, 2)
  endAmount   Decimal?      @db.Decimal(15, 2)
  status      String        @default("open") // 'open', 'closed'
  notes       String?
  invoices    Invoice[]
  transactions Transaction[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model Invoice {
  id             Int           @id @default(autoincrement())
  code           String        @unique
  customer       Customer?     @relation(fields: [customerId], references: [id])
  customerId     Int?
  user           User          @relation(fields: [userId], references: [id])
  userId         Int
  shift          Shift?        @relation(fields: [shiftId], references: [id])
  shiftId        Int?
  warehouse      Warehouse     @relation(fields: [warehouseId], references: [id])
  warehouseId    Int
  invoiceDate    DateTime      @default(now())
  subtotal       Decimal       @db.Decimal(15, 2)
  taxAmount      Decimal       @default(0) @db.Decimal(15, 2)
  discountAmount Decimal       @default(0) @db.Decimal(15, 2)
  totalAmount    Decimal       @db.Decimal(15, 2)
  paidAmount     Decimal       @default(0) @db.Decimal(15, 2)
  paymentMethod  String?       // 'cash', 'card', 'bank_transfer', etc.
  status         String        @default("pending") // 'pending', 'paid', 'canceled'
  notes          String?
  items          InvoiceItem[]
  transactions   Transaction[]
  warranties     Warranty[]
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  @@index([customerId])
  @@index([userId])
  @@index([shiftId])
  @@index([warehouseId])
}

model InvoiceItem {
  id           Int                @id @default(autoincrement())
  invoice      Invoice            @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  invoiceId    Int
  product      Product            @relation(fields: [productId], references: [id])
  productId    Int
  quantity     Decimal            @db.Decimal(10, 2)
  unitPrice    Decimal            @db.Decimal(15, 2)
  discountRate Decimal            @default(0) @db.Decimal(5, 2)
  taxRate      Decimal            @default(0) @db.Decimal(5, 2)
  totalAmount  Decimal            @db.Decimal(15, 2)
  location     WarehouseLocation? @relation(fields: [locationId], references: [id])
  locationId   Int?
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @updatedAt

  @@index([invoiceId])
  @@index([productId])
}
```

#### 2.2.8 Bảng Bảo Hành và Báo Cáo

```prisma
// Warranties and Reports
model Warranty {
  id                Int       @id @default(autoincrement())
  code              String    @unique
  customer          Customer  @relation(fields: [customerId], references: [id])
  customerId        Int
  product           Product   @relation(fields: [productId], references: [id])
  productId         Int
  invoice           Invoice?  @relation(fields: [invoiceId], references: [id])
  invoiceId         Int?
  issueDescription  String?
  receivedDate      DateTime  @default(now())
  expectedReturnDate DateTime?
  actualReturnDate  DateTime?
  status            String    @default("pending") // 'pending', 'processing', 'completed', 'rejected'
  notes             String?
  creator           User      @relation("WarrantyCreator", fields: [creatorId], references: [id])
  creatorId         Int
  technician        User?     @relation("WarrantyTechnician", fields: [technicianId], references: [id])
  technicianId      Int?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@index([customerId])
  @@index([productId])
  @@index([invoiceId])
}

model ReportTemplate {
  id            Int      @id @default(autoincrement())
  name          String
  description   String?
  reportType    String   // 'sales', 'inventory', 'financial', etc.
  queryTemplate String
  parameters    Json?
  createdBy     User     @relation(fields: [createdById], references: [id])
  createdById   Int
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## 3. MongoDB Schema

### 3.1 Collection `logs`

```js
{
  _id: ObjectId,
  userId: Number,
  action: String, // Ví dụ: 'login', 'create_user', 'update_product'
  resourceType: String, // Ví dụ: 'user', 'warehouse', 'product'
  resourceId: String,
  details: Object, // Chi tiết hành động
  userMetadata: {
    name: String,
    email: String,
    roles: Array
  },
  ipAddress: String,
  createdAt: Date
}
```

### 3.2 Collection `inventory_logs`

```js
{
  _id: ObjectId,
  transactionId: Number,
  productId: Number,
  warehouseId: Number,
  locationId: Number,
  oldQuantity: Number,
  newQuantity: Number,
  change: Number,
  userId: Number,
  notes: String,
  timestamp: Date
}
```

### 3.3 Collection `sales_analytics`

```js
{
  _id: ObjectId,
  date: Date,
  productId: Number,
  categoryId: Number,
  warehouseId: Number,
  customerId: Number,
  customerGroupId: Number,
  quantity: Number,
  revenue: Number,
  cost: Number,
  profit: Number,
  discount: Number,
  metadata: Object // Thông tin phân tích bổ sung
}
```

### 3.4 Collection `analytics_reports`

```js
{
  _id: ObjectId,
  reportId: String,
  reportName: String,
  generatedAt: Date,
  userId: Number,
  parameters: Object,
  results: Array,
  aggregationPipeline: Array, // MongoDB aggregation pipeline
  visualizationConfig: Object // Cấu hình hiển thị
}
```

### 3.5 Collection `forecasting_models`

```js
{
  _id: ObjectId,
  modelType: String, // "time_series", "regression", etc.
  productId: Number,
  categoryId: Number,
  parameters: Object,
  trainingData: Object,
  lastUpdated: Date,
  forecastResults: Array,
  accuracyMetrics: Object
}
```

## 4. Redis Key Patterns

### 4.1 Session Management

- `session:<user_id>`: Lưu JWT session, giá trị JSON `{ token, expires_at }`, TTL: 24 giờ

### 4.2 Product Caching

- `product:<product_id>`: Cache sản phẩm, TTL: 1 giờ
- `products:warehouse:<warehouse_id>`: Cache danh sách sản phẩm theo kho, TTL: 1 giờ
- `product:inventory:<product_id>:<warehouse_id>`: Cache tồn kho sản phẩm, TTL: 30 phút

### 4.3 Customer và Group Caching

- `customer:group:<group_id>`: Cache thông tin nhóm khách hàng, TTL: 1 giờ
- `customer:<customer_id>:group`: Cache nhóm khách hàng theo khách hàng, TTL: 1 giờ
- `price:list:<price_list_id>`: Cache bảng giá, TTL: 30 phút
- `price:product:<product_id>:group:<group_id>`: Cache giá sản phẩm theo nhóm khách hàng, TTL: 30 phút

### 4.4 Warehouse Location Caching

- `warehouse:location:<location_id>`: Cache thông tin vị trí lưu trữ, TTL: 1 giờ
- `warehouse:locations:<warehouse_id>`: Cache danh sách vị trí theo kho, TTL: 1 giờ
- `product:location:<product_id>:warehouse:<warehouse_id>`: Cache vị trí sản phẩm trong kho, TTL: 30 phút
- `product:<product_id>:warehouse:<warehouse_id>:best_location`: Cache gợi ý vị trí tốt nhất cho sản phẩm, TTL: 30 phút

### 4.5 Report Caching

- `report:<report_id>:<params_hash>`: Cache kết quả báo cáo, TTL: 15 phút
- `dashboard:user:<user_id>:<params_hash>`: Cache dữ liệu dashboard theo người dùng, TTL: 5 phút
- `analytics:<analysis_type>:<params_hash>`: Cache kết quả phân tích, TTL: 30 phút
- `analytics:forecast:product:<product_id>`: Cache kết quả dự báo sản phẩm, TTL: 30 phút

## 5. Mối Quan Hệ Giữa Các Database

### 5.1 PostgreSQL - MongoDB

- **ID Mapping**: Sử dụng ID từ PostgreSQL làm tham chiếu trong MongoDB (productId, warehouseId, customerId, v.v.)
- **Log Synchronization**: Mọi thay đổi trong PostgreSQL được log vào MongoDB
- **Aggregation**: Dữ liệu từ PostgreSQL được tổng hợp và lưu vào MongoDB để phân tích

### 5.2 PostgreSQL/MongoDB - Redis

- **Cache Invalidation**: Khi dữ liệu trong PostgreSQL thay đổi, các cache liên quan trong Redis được invalidate
- **Prefetching**: Dữ liệu thường xuyên truy cập được prefetch vào Redis
- **Report Caching**: Kết quả báo cáo và phân tích từ MongoDB được cache trong Redis

## 6. Chiến Lược Sao Lưu và Phục Hồi

### 6.1 PostgreSQL
- Sao lưu đầy đủ hàng ngày
- Sao lưu gia tăng mỗi giờ
- Lưu WAL logs để phục hồi theo thời điểm (PITR)

### 6.2 MongoDB
- Replica set với ít nhất 3 node
- Sao lưu đầy đủ hàng ngày
- Sao lưu oplog

### 6.3 Redis
- Cấu hình persistence với RDB (mỗi giờ) và AOF (real-time)
- Replica cho high availability

## 7. Kế Hoạch Migration và Versioning

### 7.1 PostgreSQL với Prisma

- Sử dụng Prisma Migrate để quản lý schema
- Version control các migration files
- Tạo migration riêng cho mỗi tính năng mới

```bash
# Tạo migration mới
npx prisma migrate dev --name add_customer_groups

# Apply migration cho production
npx prisma migrate deploy
```

### 7.2 MongoDB

- Sử dụng schema validation để đảm bảo tính nhất quán
- Thêm trường version vào mỗi document để theo dõi cấu trúc
- Migration scripts để cập nhật dữ liệu khi schema thay đổi
