import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Response extends Document {
  @Prop({ required: true })
  user_id: string; 

  @Prop({ required: true })
  quiz_id: string; 

  @Prop({ required: true, type: [{ question_id: String, answer: String }] })
  answers: { question_id: string; answer: string }[];

  @Prop({ required: true, type: Number })
  score: number; 

  @Prop({ required: true, type: Date })
  submitted_at: Date; 
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
