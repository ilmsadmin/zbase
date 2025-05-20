import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ForecastingModelDocument = ForecastingModel & Document;

@Schema({
  timestamps: true,
  collection: 'forecasting_models',
})
export class ForecastingModel {
  @Prop({ required: true })
  modelName: string;

  @Prop({ required: true })
  targetEntity: string; // product, category, customer_group, warehouse

  @Prop({ required: true })
  targetId: number;

  @Prop({ required: true })
  algorithm: string;

  @Prop({ type: Object })
  parameters: Record<string, any>;

  @Prop({ type: Object })
  trainingData: any;

  @Prop({ type: Object })
  modelState: any;

  @Prop()
  accuracy?: number;

  @Prop()
  lastTrainingDate?: Date;

  @Prop({ type: Object })
  predictions: Record<string, any>;

  @Prop()
  nextRetrainingDate?: Date;

  @Prop()
  userId?: number;

  @Prop()
  active?: boolean;

  @Prop()
  notes?: string;
}

export const ForecastingModelSchema = SchemaFactory.createForClass(ForecastingModel);

// Indexes
ForecastingModelSchema.index({ targetEntity: 1, targetId: 1 });
ForecastingModelSchema.index({ algorithm: 1 });
ForecastingModelSchema.index({ lastTrainingDate: -1 });
ForecastingModelSchema.index({ accuracy: -1 });
ForecastingModelSchema.index({ active: 1 });
