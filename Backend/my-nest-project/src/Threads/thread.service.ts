import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thread} from './models/Thread.schema';
import { ThreadMessage } from 'src/threadMessages/models/threadMessages.schema';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
// import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { Forum } from 'src/forum/models/forums.schema'; 
// import { ForumService } from 'src/Forums/forum.service';


@Injectable()
export class ThreadService {
  constructor(

    @InjectModel(Thread.name) private threadModel: Model<Thread>,
    // @InjectModel(Message.name) private messageModel: Model<Message>,
     @InjectModel(Forum.name) private readonly forumModel: Model<Forum>,
    // @Inject(forwardRef(() => ForumService)) private forumService: ForumService,

  ) {}


  async createThreadForForum(forumId: string, data:CreateThreadDto): Promise<Thread> {

    const thread = new this.threadModel(data);
    await thread.save();
  
    // Update the forum to include the new thread
    const forum = await this.forumModel.findById(forumId);
    forum.threads.push(thread.id);
    await forum.save();
    return thread;
  }
  async getAllThreads() {
    return this.threadModel.find().exec();
  }
  
  async getThreadById(id: string): Promise<Thread> {
    const thread = await this.threadModel.findById(id).populate('messages').exec();
    if (!thread) throw new NotFoundException(`Thread with ID ${id} not found`);
    return thread;
  }

  async updateThread(id: string ,data:UpdateThreadDto): Promise<Thread> {
    return this.threadModel.findByIdAndUpdate(id, {data}, { new: true }).exec();
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
