import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Notes extends Document {
  @Prop({ required: true })
  user_id: string; 

  @Prop({ required: true })
  course_id: string; 

  @Prop({ required: true })
  content: string; 

  @Prop({ required: true, type: Date })
  created_at: Date; 

  @Prop({ required: true, type: Date })
  last_updated: Date; 
}

export const NotesScema = SchemaFactory.createForClass(Notes);
