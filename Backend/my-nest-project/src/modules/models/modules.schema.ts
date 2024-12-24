import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { resource } from '../../resources/models/resourse.schema';

@Schema()
export class Modules extends Document {
  @Prop({ type: String, required: true })
  course_id: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: [{ type: Types.ObjectId }], required: false })
  resources: resource[];

  @Prop({ required: true, type: Number })
  rating: number;
  
  @Prop({ type: [Number], default: [] })
  ratings: number[];

  // // New Field: Soft Delete
  // @Prop({ type: Boolean, default: false })
  // isDeleted: boolean; // true = soft-deleted, false = active
}

export const ModulesSchema = SchemaFactory.createForClass(Modules);
