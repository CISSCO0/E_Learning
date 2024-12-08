import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thread, ThreadDocument } from './models/threads.schema';

@Injectable()
export class ThreadService {
  constructor(@InjectModel(Thread.name) private threadModel: Model<ThreadDocument>) {}

  async getAllThreads() {
    return this.threadModel.find().exec();
  }

  async getThreadById(id: string) {
    return this.threadModel.findById(id).exec();
  }

  async createThread(data: any) {
    return this.threadModel.create(data);
  }

  async updateThread(id: string, updateData: any) {
    return this.threadModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteThread(id: string) {
    const thread = await this.threadModel.findById(id).exec();
    if (!thread) throw new Error('Thread not found');
    return this.threadModel.findByIdAndDelete(id).exec();
  }
}
