import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Notification {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  senderId: string; // ID of the sender

  @Prop({ required: true })
  receiverId: string; // ID of the recipient

  @Prop({ required: true })
  message: string; // Content of the notification

  @Prop({ default: false })
  read: boolean; // Whether the notification has been read

  @Prop({ default: Date.now })
  createdAt: Date; // When the notification was created

  @Prop()
  type: string; // Type of notification (e.g., "info", "warning", "alert")
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
export type NotificationDocument = HydratedDocument<Notification>;
