import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import  {Document} from 'mongoose';

@Schema()
export class Thread extends Document {

  @Prop({ required: true })
  title: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    required: true,
  })
  messages: mongoose.Types.ObjectId[];
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);
