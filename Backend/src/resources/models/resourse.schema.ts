import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class resource extends Document {
  @Prop({ type: String, required: true })
  type: string;
  @Prop({ type: String, required: true })
  content: string;
  @Prop({ type: String, required: true })
  fileName: string;
  @Prop({ type: String, required: true })
  filePath: string;
  
  @Prop({ type: String })
  outdated: String; // true = hidden from students, false = active

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}

export const ResourceSchema = SchemaFactory.createForClass(resource);