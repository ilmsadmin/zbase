import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum LogActionType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  CREATE_USER = 'create_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  
  // Warehouse actions
  CREATE_WAREHOUSE = 'create_warehouse',
  UPDATE_WAREHOUSE = 'update_warehouse',
  DELETE_WAREHOUSE = 'delete_warehouse',
  
  // Product actions
  CREATE_PRODUCT = 'create_product',
  UPDATE_PRODUCT = 'update_product',
  DELETE_PRODUCT = 'delete_product',
  
  // Inventory actions
  IMPORT_INVENTORY = 'import_inventory',
  EXPORT_INVENTORY = 'export_inventory',
  
  // Customer actions
  CREATE_CUSTOMER = 'create_customer',
  UPDATE_CUSTOMER = 'update_customer',
  DELETE_CUSTOMER = 'delete_customer',
  
  // Partner actions
  CREATE_PARTNER = 'create_partner',
  UPDATE_PARTNER = 'update_partner',
  DELETE_PARTNER = 'delete_partner',
  
  // Invoice actions
  CREATE_INVOICE = 'create_invoice',
  UPDATE_INVOICE = 'update_invoice',
  DELETE_INVOICE = 'delete_invoice',
  CHANGE_INVOICE_STATUS = 'change_invoice_status',
  
  // Transaction actions
  CREATE_TRANSACTION = 'create_transaction',
  UPDATE_TRANSACTION = 'update_transaction',
  DELETE_TRANSACTION = 'delete_transaction',
  
  // Warranty actions
  CREATE_WARRANTY = 'create_warranty',
  UPDATE_WARRANTY = 'update_warranty',
  CHANGE_WARRANTY_STATUS = 'change_warranty_status',
  
  // Shift actions
  OPEN_SHIFT = 'open_shift',
  CLOSE_SHIFT = 'close_shift',
  
  // Sales actions
  CREATE_SALE = 'create_sale'
}

export enum LogResourceType {
  USER = 'user',
  WAREHOUSE = 'warehouse',
  PRODUCT = 'product',
  CATEGORY = 'category',
  INVENTORY = 'inventory',
  CUSTOMER = 'customer',
  PARTNER = 'partner',
  INVOICE = 'invoice',
  TRANSACTION = 'transaction',
  WARRANTY = 'warranty',
  SHIFT = 'shift'
}

@Schema({ 
  timestamps: true,
  collection: 'logs'
})
export class Log extends Document {
  @Prop({ required: true, index: true })
  userId: number;

  @Prop({ required: true, index: true, enum: Object.values(LogActionType) })
  action: string;

  @Prop({ type: String, index: true, enum: Object.values(LogResourceType) })
  resourceType?: string;

  @Prop({ type: String, index: true })
  resourceId?: string;

  @Prop({ type: Object })
  details: Record<string, any>;

  @Prop({ type: Date, index: true })
  createdAt: Date;

  @Prop({ type: String, index: true })
  ipAddress?: string;

  // Metadata about the user who performed the action
  @Prop({ type: Object })
  userMetadata?: {
    name?: string;
    email?: string;
    roles?: string[];
  };
}

export const LogSchema = SchemaFactory.createForClass(Log);

// Create compound indexes for common queries
LogSchema.index({ userId: 1, action: 1 });
LogSchema.index({ action: 1, resourceType: 1 });
LogSchema.index({ resourceType: 1, resourceId: 1 });
LogSchema.index({ createdAt: -1 }); // For date range queries
LogSchema.index({ action: 1, createdAt: -1 }); // For filtering actions by date
