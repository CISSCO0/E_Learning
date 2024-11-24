import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Forum {
  @Prop({ required: true })
  forumId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  })
  courseId: mongoose.Types.ObjectId;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }],
    required: true,
  })
  threads: mongoose.Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    required: true,
  })
  instructorId: mongoose.Types.ObjectId;
}

export const ForumSchema = SchemaFactory.createForClass(Forum);
