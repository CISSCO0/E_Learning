import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ThreadMessage, ThreadMessageDocument } from './models/threadMessages.schema';
import { Thread} from 'src/thread/models/threads.schema'
import { CreateThreadMessageDto } from './dto/creatThreadMessage.dto';

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

  async create(createThreadMessageDto: CreateThreadMessageDto, userId:string): Promise<ThreadMessage> {
    createThreadMessageDto.senderId = userId;
    // Create and save the new message
    const newMessage = new this.threadMessageModel(createThreadMessageDto);
    await newMessage.save();

    // Find the thread by threadId and push the new message ID to the thread's messages array
    await this.ThreadModel.findByIdAndUpdate(
      createThreadMessageDto.threadId,
      { $push: { messages: newMessage._id } }, // assuming `messages` is an array in your Thread schema
      { new: true } // Return the updated thread document
    );

    return newMessage;
  }

  async deleteThreadMessage(id: string) {
    return this.threadMessageModel.findByIdAndDelete(id).exec();
  }

  

  async findByThreadId(threadId: string): Promise<ThreadMessage[]> {
    return this.threadMessageModel.find({ threadId }).exec();
  }
}
