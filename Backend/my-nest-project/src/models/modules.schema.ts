import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

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

  @Prop({ required: true, type: Number })
  rating: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    required: true,
  })
  quizzes: mongoose.Types.ObjectId[];
}

export const ModulesSchema = SchemaFactory.createForClass(Modules);
