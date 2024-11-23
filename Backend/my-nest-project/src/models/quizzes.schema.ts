import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Quizzes extends Document{
//use mongoid
//   @Prop({ required: true })
//   quiz_id: string;

  @Prop({ type:String,required: true })
  module_id: string;

  @Prop({ type: [Object], required: true })
  questions: Array<Record<string, any>>;
  
  @Prop ({type:String ,required :true })
  answers: Array<string>;

  @Prop({ type:Date ,required: true, default: Date.now })
  created_at: Date;
}

export const QuizzesSchema = SchemaFactory.createForClass(Quizzes);
