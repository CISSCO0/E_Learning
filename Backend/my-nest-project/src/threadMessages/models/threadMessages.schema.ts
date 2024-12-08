import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ThreadMessage {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  threadId: string;
}

export type ThreadMessageDocument = ThreadMessage & Document;
export const ThreadMessageSchema = SchemaFactory.createForClass(ThreadMessage);
