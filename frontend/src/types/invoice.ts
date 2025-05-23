export interface Invoice {
  id: string;
  code: string;
  customerId?: string;
  customerName?: string;
  userId: string;
  userName?: string;
  shiftId?: string;
  warehouseId: string;
  warehouseName?: string;
  invoiceDate: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  paymentMethod?: string;
  status: 'pending' | 'paid' | 'canceled' | 'overdue';
  notes?: string;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  discountRate: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  locationId?: string;
  locationName?: string;
  serialNumbers?: string;
  serialNumber?: string;
  warrantyExpiration?: string;
  notes?: string;
}

export interface InvoiceFilters {
  search?: string;
  customerId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  warehouseId?: string;
}

export interface CreateInvoiceItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
  discountRate?: number;
  discountAmount?: number;
  taxRate?: number;
  taxAmount?: number;
  totalAmount?: number;
  locationId?: string;
  serialNumbers?: string;
  serialNumber?: string;
  warrantyExpiration?: string;
  notes?: string;
}

export interface CreateInvoiceDto {
  customerId?: string;
  warehouseId: string;
  invoiceDate?: string;
  subtotal?: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount?: number;
  paidAmount?: number;
  paymentMethod?: string;
  status?: string;
  notes?: string;
  items: CreateInvoiceItemDto[];
}
