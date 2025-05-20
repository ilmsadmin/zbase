import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SalesAnalyticsDocument = SalesAnalytics & Document;

@Schema({
  timestamps: true,
  collection: 'sales_analytics',
})
export class SalesAnalytics {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, default: 0 })
  totalSales: number;

  @Prop({ required: true, default: 0 })
  totalInvoices: number;

  @Prop({ required: true, default: 0 })
  totalCustomers: number;

  @Prop({ required: true, default: 0 })
  totalItems: number;

  @Prop({ type: Object })
  productSales: Record<string, number>;

  @Prop({ type: Object })
  categorySales: Record<string, number>;

  @Prop({ type: Object })
  customerGroupSales: Record<string, number>;

  @Prop({ type: Object })
  hourlyDistribution: Record<string, number>;

  @Prop({ required: true, default: 0 })
  averageInvoiceValue: number;

  @Prop()
  warehouseId?: number;

  @Prop()
  warehouseName?: string;
}

export const SalesAnalyticsSchema = SchemaFactory.createForClass(SalesAnalytics);

// Indexes
SalesAnalyticsSchema.index({ date: -1 });
SalesAnalyticsSchema.index({ warehouseId: 1 });
