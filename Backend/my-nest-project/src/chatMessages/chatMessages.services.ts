import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage, ChatMessageDocument } from './models/chatMessages.schema';

@Injectable()
export class ChatMessageService {
  constructor(@InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessageDocument>) {}

  async getAllChatMessages() {
    return this.chatMessageModel.find().exec();
  }

  async getChatMessageById(id: string) {
    return this.chatMessageModel.findById(id).exec();
  }

  async createChatMessage(data: any) {
    return this.chatMessageModel.create(data);
  }

  async deleteChatMessage(id: string) {
    return this.chatMessageModel.findByIdAndDelete(id).exec();
  }
}
