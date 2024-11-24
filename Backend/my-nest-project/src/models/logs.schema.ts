import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Log {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  event: string; // Description of the event (e.g., "User Login", "Course Created")

  @Prop()
  userId?: string; // ID of the user who triggered the event 

  @Prop()
  adminId?: string; // ID of the admin who triggered the event 

  @Prop({ default: Date.now })
  timestamp: Date; // When the log was created

  @Prop()
  status: string; // Status of the event (e.g., "Success", "Failure")
}

export const LogSchema = SchemaFactory.createForClass(Log);
export type LogDocument = HydratedDocument<Log>;
