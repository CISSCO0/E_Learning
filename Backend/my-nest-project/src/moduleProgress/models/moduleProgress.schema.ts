import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ModuleProgress extends Document {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  module_id: string;

  @Prop({ required: true, default: 0 })
  percentage: number; // Progress percentage

  @Prop({ type: [Number], default: [] })
  performance: number[];
}

export const ModuleProgressSchema = SchemaFactory.createForClass(ModuleProgress);
