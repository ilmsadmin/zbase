// Định nghĩa các kiểu dữ liệu chung

// Kiểu dữ liệu người dùng
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profileImage?: string; // Optional user profile image URL
  permissions?: string[]; // Array of permission strings
  createdAt: string;
  updatedAt: string;
}

// Kiểu dữ liệu vai trò người dùng
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  INVENTORY = 'INVENTORY',
  CUSTOMER = 'CUSTOMER',
}

// Kiểu dữ liệu sản phẩm
export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  price: number;
  costPrice?: number;
  categoryId?: string;
  category?: ProductCategory;
  attributes?: ProductAttribute[];
  imageUrl?: string; // Optional product image URL
  createdAt: string;
  updatedAt: string;
  inventory?: InventoryItem[];
}

// Kiểu dữ liệu danh mục sản phẩm
export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  parent?: ProductCategory;
  children?: ProductCategory[];
  createdAt: string;
  updatedAt: string;
}

// Kiểu dữ liệu thuộc tính sản phẩm
export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
  productId: string;
}

// Kiểu dữ liệu kho hàng
export interface Warehouse {
  id: string;
  name: string;
  address?: string;
  description?: string;
  isDefault: boolean;
  managerId?: string;
  locations?: WarehouseLocation[];
  createdAt: string;
  updatedAt: string;
}

// Kiểu dữ liệu vị trí trong kho
export interface WarehouseLocation {
  id: string;
  name: string;
  description?: string;
  warehouseId: string;
  parentId?: string;
  parent?: WarehouseLocation;
  children?: WarehouseLocation[];
}

// Kiểu dữ liệu tồn kho
export interface InventoryItem {
  id: string;
  productId: string;
  product?: Product;
  warehouseId: string;
  warehouse?: Warehouse;
  locationId?: string;
  location?: WarehouseLocation;
  quantity: number;
  minQuantity?: number;
  maxQuantity?: number;
  createdAt: string;
  updatedAt: string;
}

// Kiểu dữ liệu khách hàng
export interface Customer {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  groupId?: string;
  group?: CustomerGroup;
  totalPurchases?: number;
  lastPurchaseDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Kiểu dữ liệu nhóm khách hàng
export interface CustomerGroup {
  id: string;
  name: string;
  description?: string;
  discountPercent?: number;
  createdAt: string;
  updatedAt: string;
}

// Kiểu dữ liệu hóa đơn
export interface Invoice {
  id: string;
  code: string;
  customerId?: string;
  customer?: Customer;
  userId: string;
  user?: User;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// Kiểu dữ liệu chi tiết hóa đơn
export interface InvoiceItem {
  id: string;
  invoiceId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  discount: number;
  subtotal: number;
}

// Phương thức thanh toán
export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  MOMO = 'MOMO',
  VNPAY = 'VNPAY',
  ZALOPAY = 'ZALOPAY',
  OTHER = 'OTHER',
}

// Trạng thái thanh toán
export enum PaymentStatus {
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  UNPAID = 'UNPAID',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

// Kiểu dữ liệu giao dịch
export interface Transaction {
  id: string;
  code: string;
  amount: number;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  invoiceId?: string;
  invoice?: Invoice;
  customerId?: string;
  customer?: Customer;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// Loại giao dịch
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

// Trạng thái giao dịch
export enum TransactionStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

// Kiểu dữ liệu bảo hành
export interface Warranty {
  id: string;
  productId: string;
  product?: Product;
  customerId: string;
  customer?: Customer;
  invoiceId: string;
  invoice?: Invoice;
  startDate: string;
  endDate: string;
  status: WarrantyStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// Trạng thái bảo hành
export enum WarrantyStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  USED = 'USED',
  CANCELLED = 'CANCELLED',
}
