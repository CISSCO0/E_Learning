import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Question extends Document {

  @Prop({ required: true })
  answer: string; 

  @Prop({ required: true })
  level: string; 

  @Prop({ required: true })
  type: string; 

  @Prop({ required: true })
  content: string; 
 
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
