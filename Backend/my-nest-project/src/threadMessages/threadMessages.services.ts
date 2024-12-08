import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ThreadMessage, ThreadMessageDocument } from './models/threadMessages.schema';

@Injectable()
export class ThreadMessageService {
  constructor(@InjectModel(ThreadMessage.name) private threadMessageModel: Model<ThreadMessageDocument>) {}

  async getAllThreadMessages() {
    return this.threadMessageModel.find().exec();
  }

  async getThreadMessageById(id: string) {
    return this.threadMessageModel.findById(id).exec();
  }

  async createThreadMessage(data: any) {
    return this.threadMessageModel.create(data);
  }

  async deleteThreadMessage(id: string) {
    return this.threadMessageModel.findByIdAndDelete(id).exec();
  }
}
