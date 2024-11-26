import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema()
export class QuestionBank extends Document {
  @Prop({ required: true })
  module_id: string; 

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    required: true,
  })
  questions: mongoose.Types.ObjectId[];
 
}

export const QuestionBankShema = SchemaFactory.createForClass(QuestionBank);
