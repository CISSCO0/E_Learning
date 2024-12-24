import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Quizzes extends Document{
//use mongoid
//   @Prop({ required: true })
//   quiz_id: string;

  @Prop({ type:String,required: true })
  module_id: string;

  @Prop({ type:String,required: true })
  questionBank_id: string;

  @Prop({ type:Date ,required: true, default: Date.now })
  created_at: Date;

  @Prop({ type:String,required: true })
  level: string;

  @Prop({ type:Number,required: true })
  numberOfQuestions: Number;

  @Prop({ required: true })
  type: string; // e.g., 'mcq' or 'true/false' or 'both'

}

export const QuizzesSchema = SchemaFactory.createForClass(Quizzes);
