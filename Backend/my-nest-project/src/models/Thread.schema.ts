import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Thread {
  @Prop({ required: true })
  threadId: string;

  @Prop({ required: true })
  title: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    required: true,
  })
  messages: mongoose.Types.ObjectId[];
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);
