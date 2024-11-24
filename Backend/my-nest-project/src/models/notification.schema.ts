import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Notification extends Document {

  @Prop({ required: true })
  senderId: string; // ID of the sender

  @Prop({ type:[String], required: true })
  receiverId: string[]; // ID of the recipient

  @Prop({ required: true })
  content: string; // Content of the notification

  @Prop({ default: false })
  read: boolean; // Whether the notification has been read

  @Prop({ default: Date.now })
  createdAt: Date; // When the notification was created

  @Prop()
  type: string; // Type of notification (e.g., "info", "warning", "alert")
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
