import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ThreadMessage, ThreadMessageDocument } from './models/threadMessages.schema';
import { Thread } from '../Threads/models/Thread.schema';
 @Injectable()
 export class ThreadMessageService {
  constructor(@InjectModel(ThreadMessage.name) private threadMessageModel: Model<ThreadMessageDocument>,
  @InjectModel(Thread.name) private ThreadModel : Model<Thread>
) {}

  async getAllThreadMessages() {
    return this.threadMessageModel.find().exec();
  }

  async getThreadMessageById(id: string) {
    return this.threadMessageModel.findById(id).exec();
  }

  async getMessages(threadId: string) {
    return this.threadMessageModel.find({ thread_id: threadId });
  }

  async createThreadMessage(thread_id,data: any) {
    const message = this.threadMessageModel.create(data);
    (await message).save()
     // Update the forum to include the new thread
     const thread= await this.ThreadModel.findById(thread_id);
     thread.messages.push((await message).id);
     await thread.save();
     return message;
  }

  async deleteThreadMessage(id: string) {
    return this.threadMessageModel.findByIdAndDelete(id).exec();
  }
}
