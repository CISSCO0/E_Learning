import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Courses extends Document {
  @Prop({ type:String,required: true })
  title: string;

  @Prop({ type:String,required: true })
  description: string;

  @Prop({ type:String,required: true })
  category: string;

  @Prop({ type:String,required: true })
  difficulty_level: string;

  @Prop({ type:String,required: true })
  created_by: string; 

  @Prop({ type:Date,required: true, default: Date.now })
  created_at: Date;

  @Prop({ type:String,required: true })
  instructor: string; 
}

export const CoursesSchema = SchemaFactory.createForClass(Courses);
