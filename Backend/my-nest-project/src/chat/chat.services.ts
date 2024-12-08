import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './models/chat.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async getAllChats() {
    return this.chatModel.find().exec();
  }

  async getChatById(id: string) {
    return this.chatModel.findById(id).exec();
  }

  async createChat(data: any) {
    return this.chatModel.create(data);
  }

  async updateChat(id: string, updateData: any) {
    return this.chatModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteChat(id: string) {
    const chat = await this.chatModel.findById(id).exec();
    if (!chat) throw new Error('Chat not found');
    return this.chatModel.findByIdAndDelete(id).exec();
  }
}
