import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {Document} from 'mongoose';

@Schema()
export class Chat extends Document{

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    required: true,
  })
  users: mongoose.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    required: true,
  })
  messages: mongoose.Types.ObjectId[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
