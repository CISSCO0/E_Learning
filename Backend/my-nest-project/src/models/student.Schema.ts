import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define the Student Document Interface
export type StudentDocument = Student & Document;

@Schema()
export class Student {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  role_id: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Courses' }] })
  enrolled_courses: Types.ObjectId[];

  @Prop({ type: [String] }) // Array of course preferences
  course_pref: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Instructor' }] })
  instructors: Types.ObjectId[];

  @Prop({ type: [String] }) // Array of certificate identifiers/paths
  certificates: string[];
}

// Generate the schema using SchemaFactory
export const StudentSchema = SchemaFactory.createForClass(Student);