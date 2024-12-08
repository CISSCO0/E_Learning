import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import  {Document} from 'mongoose';
import { ForumModule } from 'src/Forums/forum.module'; // Import ForumModule
@Schema()
export class Thread extends Document {
  static deleteMany(arg0: { _id: { $in: any; }; }) {
    throw new Error('Method not implemented.');
  }

  @Prop({ required: true })
  title: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    required: true,
  })
  messages: mongoose.Types.ObjectId[];
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);
