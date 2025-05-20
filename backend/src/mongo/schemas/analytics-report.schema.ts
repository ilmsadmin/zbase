import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnalyticsReportDocument = AnalyticsReport & Document;

@Schema({
  timestamps: true,
  collection: 'analytics_reports',
})
export class AnalyticsReport {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  type: string; // sales, inventory, financial, customer, etc.

  @Prop({ required: true })
  period: string; // daily, weekly, monthly, quarterly, yearly, custom

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: Object })
  parameters: Record<string, any>;

  @Prop({ type: Object })
  data: any;

  @Prop()
  chart?: string; // JSON representation of chart configuration

  @Prop()
  summary?: string;

  @Prop()
  userId?: number;

  @Prop()
  warehouseId?: number;

  @Prop({ type: Object })
  filters?: Record<string, any>;

  @Prop()
  exportPath?: string;
}

export const AnalyticsReportSchema = SchemaFactory.createForClass(AnalyticsReport);

// Indexes
AnalyticsReportSchema.index({ type: 1 });
AnalyticsReportSchema.index({ period: 1 });
AnalyticsReportSchema.index({ startDate: -1, endDate: -1 });
AnalyticsReportSchema.index({ userId: 1 });
AnalyticsReportSchema.index({ warehouseId: 1 });
AnalyticsReportSchema.index({ createdAt: -1 });
