import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Thread } from 'src/Threads/models/Thread.schema';

@Schema()
export class Forum extends Document {

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  courseId: mongoose.Types.ObjectId;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    required: true,
  })
  threads: mongoose.Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  instructorId: mongoose.Types.ObjectId;
}

// // Pre-remove hook to delete threads when the forum is deleted
// ForumSchema.pre('remove', async function (next) {
//   try {
//     // Delete all threads that are related to this forum
//     await Thread.deleteMany({ _id: { $in: this.threads } });
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

export const ForumSchema = SchemaFactory.createForClass(Forum);
