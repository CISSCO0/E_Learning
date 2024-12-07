import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Progress extends Document {
  @Prop({ required: true })
  user_id: string; 

  @Prop({ required: true })
  course_id: string; 

  @Prop({ required: true, type: Number, min: 0, max: 100 })
  completion_percentage: number;

  @Prop({ required: true, type: Date })
  last_accessed: Date; 

  @Prop({ type:[String], required: true })
  performance: string[];

  @Prop({ type:[String], required: true })
  modulesId: string[];// module al by5lsaha 
  //lma progress y5ls insert fy certificate array 
  


}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
