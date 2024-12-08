import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ChatMessage, ChatMessageSchema } from 'src/chatMessages/models/chatMessages.schema';

@Schema()
export class Chat {
  @Prop({ type: [String], required: true })
  users: string[];

  @Prop({ type: [ChatMessageSchema], default: [] })
  messages: ChatMessage[];

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  date: Date;
}

export type ChatDocument = Chat & Document;
export const ChatSchema = SchemaFactory.createForClass(Chat);
