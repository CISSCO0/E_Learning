import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thread} from './models/Thread.schema';
import { Message } from '../messages/models/messeageSchema';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { Forum } from 'src/Forums/models/forum.schema';


@Injectable()
export class ThreadService {
  constructor(
    @InjectModel(Thread.name) private readonly threadModel: Model<Thread>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(Forum.name) private readonly forumModel: Model<Forum>, // Inject ForumModel here
  ) {}


  async createThreadForForum(
    forumId: string,
    { title, initialMessage, senderId }: { title: string; initialMessage: string; senderId: string },
  ): Promise<Thread> {
    const thread = new this.threadModel({ title, messages: [] });
  
    // Create the initial message for the thread
    const message = new this.messageModel({
      content: initialMessage,
      senderId,
      chat_id: thread._id,
    });// call api message 
  
    // Save both thread and initial message
    await message.save();
    thread.messages.push(message.id);
    await thread.save();
  
    // Update the forum to include the new thread
    const forum = await this.forumModel.findById(forumId);
    forum.threads.push(thread.id);
    await forum.save();
  
    return thread;
  }
  

  async getMessages(threadId: string) {
    return await this.messageModel.find({ thread_id: threadId }).exec();// get array of message from thread id logic error 
  }
  async createThread(title: string, messages: string[]): Promise<Thread> {
    const newThread = new this.threadModel({ title, messages: [] });
    return newThread.save();
  }
  // async createThread(title: string, messages: string[]): Promise<Thread> {
  //   const newThread = new this.threadModel({ title, messages });
  //   return newThread.save();
  // }

  async getThreadById(id: string): Promise<Thread> {
    const thread = await this.threadModel.findById(id).populate('messages').exec();
    if (!thread) throw new NotFoundException(`Thread with ID ${id} not found`);
    return thread;
  }

  async updateThread(id: string, messages: string[]): Promise<Thread> {
    return this.threadModel.findByIdAndUpdate(id, { messages }, { new: true }).exec();
  }

  async deleteThread(id: string): Promise<void> {
    const result = await this.threadModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Thread with ID ${id} not found`);
  }

  async searchThreadsByTitle(title: string): Promise<Thread[]> {
    const threads = await this.threadModel
      .find({ title: { $regex: title, $options: 'i' } }) // Case-insensitive search
      .exec();
    return threads;
  }
}
