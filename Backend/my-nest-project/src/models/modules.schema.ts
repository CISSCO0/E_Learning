import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Modules extends Document {
  @Prop({ type: String, required: true })
  course_id: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string; 

  @Prop({ type: [String], required: false })
  resources: string[]; 

  @Prop({ type: Date, default: Date.now })
  created_at: Date; 
}

export const ModulesSchema = SchemaFactory.createForClass(Modules);
