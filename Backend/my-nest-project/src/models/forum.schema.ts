import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema()
export class Forum extends Document {

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  courseId: mongoose.Types.ObjectId;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    required: true,
  })
  threads: mongoose.Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  instructorId: mongoose.Types.ObjectId;
}

export const ForumSchema = SchemaFactory.createForClass(Forum);
