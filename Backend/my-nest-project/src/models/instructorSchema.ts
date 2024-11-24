import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define the Instructor Document Interface
export type InstructorDocument = Instructor & Document;

@Schema()
export class Instructor {
  @Prop({ type: Types.ObjectId,required:true })
  role_id: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId }] })
  students: Types.ObjectId[];

  @Prop({ type: String, required: true }) // Field of expertise
  field: string;
}

// Generate the schema using SchemaFactory
export const InstructorSchema = SchemaFactory.createForClass(Instructor);