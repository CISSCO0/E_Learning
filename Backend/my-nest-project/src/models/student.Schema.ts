import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define the Student Document Interface
export type StudentDocument = Student & Document;

@Schema()
export class Student {
  @Prop({ type: Types.ObjectId, required: true })
  role_id: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId }] })
  enrolled_courses: Types.ObjectId[];

  @Prop({ type: [String] }) // Array of course preferences
  course_pref: string[];

  @Prop({ type: [{ type: Types.ObjectId}] })
  instructors: Types.ObjectId[];

  @Prop({ type: [String] }) // Array of certificate identifiers/paths
  certificates: string[];
}

// Generate the schema using SchemaFactory
export const StudentSchema = SchemaFactory.createForClass(Student);