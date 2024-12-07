import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type InstructorDocument = Instructor & Document;

@Schema()
export class Instructor {

  @Prop({ type: [{ type: Types.ObjectId }] })
  students: Types.ObjectId[];

  @Prop({ type: String, required: true }) 
  field: string;
  
  @Prop({ required: true, type: Number })
  rating: number;
}


export const InstructorSchema = SchemaFactory.createForClass(Instructor);