import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ThreadSchema, Thread } from 'src/Threads/models/Thread.schema';
@Schema()
export class Forum {
  @Prop({ type: [ThreadSchema], default: [] })
  threads: Thread[];

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  instructorId: string;
}

export type ForumDocument = Forum & Document;
export const ForumSchema = SchemaFactory.createForClass(Forum);