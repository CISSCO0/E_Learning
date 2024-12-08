import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message extends Document{

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Date, default: Date.now })
  time: Date;

  // @Prop({ type: Types.ObjectId, required: true })
  // chat_id: Types.ObjectId; review chta logic to get message array msh by chat id fe el message

  @Prop({ type: Types.ObjectId, required: true })
  sender_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  chat_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
thread_id: Types.ObjectId;

}


export const MessageSchema = SchemaFactory.createForClass(Message);