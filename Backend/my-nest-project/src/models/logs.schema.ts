import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Log extends Document{

  @Prop({ required: true })
  event: string; // Description of the event (e.g., "User Login", "Course Created")

  @Prop({required:true })
  userId: string; // ID of the user who triggered the event 

  @Prop({required:true})
  adminId: string; // ID of the admin who triggered the event 

  @Prop({ default: Date.now })
  timestamp: Date; // When the log was created

}

export const LogSchema = SchemaFactory.createForClass(Log);

