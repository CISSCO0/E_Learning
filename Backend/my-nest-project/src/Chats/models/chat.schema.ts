import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {Document} from 'mongoose';
import { Users } from '../../user/models/users.schema';


@Schema()
export class Chat extends Document {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    required: true,
  })
  users: Users[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    required: true,
  })
  messages: mongoose.Types.ObjectId[];

  @Prop({ type: String, required: true })
  title: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

