import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ThreadMessageSchema, ThreadMessage } from 'src/threadMessages/models/threadMessages.schema';

@Schema()
export class Thread {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [ThreadMessageSchema], default: [] })
  messages: ThreadMessage[];
}

export type ThreadDocument = Thread & Document;
export const ThreadSchema = SchemaFactory.createForClass(Thread);
