import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ReportType, ReportFormat } from '../../reports/dto/create-report.dto';

export type ReportTemplateDocument = ReportTemplate & Document;

@Schema({
  timestamps: true,
  collection: 'report_templates'
})
export class ReportTemplate {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: Object.values(ReportType) })
  reportType: ReportType;

  @Prop({ type: Object, required: true })
  templateConfig: Record<string, any>;

  @Prop()
  htmlContent?: string;

  @Prop({ type: [String] })
  requiredFields?: string[];

  @Prop({ type: [String], enum: Object.values(ReportFormat) })
  supportedFormats?: ReportFormat[];

  @Prop()
  createdBy?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDefault: boolean;
}

export const ReportTemplateSchema = SchemaFactory.createForClass(ReportTemplate);
