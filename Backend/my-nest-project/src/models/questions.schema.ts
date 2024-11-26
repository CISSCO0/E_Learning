import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Questions extends Document {

  @Prop({ required: true })
  answer: string; 

  @Prop({ required: true })
  level: string; 

  @Prop({ required: true })
  type: string; 
 
}

export const QuestionShema = SchemaFactory.createForClass(Questions);
