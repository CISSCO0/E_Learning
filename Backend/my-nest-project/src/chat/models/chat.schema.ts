import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ChatMessage, ChatMessageSchema } from 'src/chatMessages/models/chatMessages.schema';

@Schema()
export class Chat {
  @Prop({ type: [String], required: true })
  users: string[];

  @Prop({ type: [String], default: [] })
  messages: ChatMessage[];

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  courseId: string;
}

export type ChatDocument = Chat & Document;
export const ChatSchema = SchemaFactory.createForClass(Chat);
