import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ReportType, ReportFrequency, ReportFormat } from '../../reports/dto/create-report.dto';

export interface ReportDocument extends Document, Report {
  _id: any;
}

@Schema({ 
  timestamps: true,
  collection: 'reports'
})
export class Report {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: Object.values(ReportType) })
  type: ReportType;

  @Prop({ type: Object })
  configuration?: Record<string, any>;

  @Prop()
  templateId?: string;

  @Prop({ type: Date })
  startDate?: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({ enum: Object.values(ReportFrequency), default: ReportFrequency.ONCE })
  frequency?: ReportFrequency;

  @Prop({ type: [String], enum: Object.values(ReportFormat), default: [ReportFormat.PDF] })
  formats?: ReportFormat[];

  @Prop()
  createdBy?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ type: [String] })
  generatedReportUrls?: string[];

  @Prop({ type: Date })
  lastGeneratedAt?: Date;

  @Prop({ type: String })
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

  @Prop({ type: String })
  errorMessage?: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
