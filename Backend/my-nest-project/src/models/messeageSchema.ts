import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define the Message Document Interface
export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ type: String, required: true }) // Unique message ID
  msg_id: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Date, default: Date.now })
  time: Date;

  @Prop({ type: Types.ObjectId, ref: 'Chat', required: true })
  chat_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  sender_id: Types.ObjectId;
}

// Generate the schema using SchemaFactory
export const MessageSchema = SchemaFactory.createForClass(Message);