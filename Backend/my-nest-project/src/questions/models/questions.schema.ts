import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Question extends Document {
  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  type: string; // e.g., 'mcq' or 'true/false'

  @Prop({ required: true })
  content: string; // The question text

  @Prop({ type: [String], required: function() { return this.type === 'mcq'; } })
  possibleAnswers?: string[]; // Array of possible answers for MCQ

  @Prop({ required: true })
  correctAnswer: string; // The correct answer
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
