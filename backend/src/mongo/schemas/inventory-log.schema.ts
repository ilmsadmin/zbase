import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum InventoryActionType {
  IMPORT = 'import',
  EXPORT = 'export',
  TRANSFER = 'transfer',
  ADJUSTMENT = 'adjustment',
  DAMAGE = 'damage',
  RETURN = 'return',
}

export type InventoryLogDocument = InventoryLog & Document;

@Schema({
  timestamps: true,
  collection: 'inventory_logs',
})
export class InventoryLog {
  @Prop({ required: true })
  productId: number;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  productCode: string;

  @Prop({ required: true })
  warehouseId: number;

  @Prop({ required: true })
  warehouseName: string;

  @Prop()
  locationId?: number;

  @Prop()
  locationDescription?: string;

  @Prop({ required: true, enum: Object.values(InventoryActionType) })
  actionType: string;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  previousQuantity?: number;

  @Prop()
  newQuantity?: number;

  @Prop()
  referenceId?: number;

  @Prop()
  referenceType?: string;

  @Prop()
  referenceCode?: string;

  @Prop()
  userId?: number;

  @Prop()
  userName?: string;

  @Prop()
  notes?: string;
}

export const InventoryLogSchema = SchemaFactory.createForClass(InventoryLog);

// Indexes
InventoryLogSchema.index({ productId: 1 });
InventoryLogSchema.index({ warehouseId: 1 });
InventoryLogSchema.index({ createdAt: -1 });
InventoryLogSchema.index({ actionType: 1 });
InventoryLogSchema.index({ referenceId: 1, referenceType: 1 });
