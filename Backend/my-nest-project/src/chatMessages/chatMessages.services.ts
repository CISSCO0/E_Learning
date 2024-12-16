import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage, ChatMessageDocument } from './models/chatMessages.schema';


@Injectable()
export class ChatMessageService {
  createMessagee(chatId: string, senderId: string, content: string) {
    throw new Error('Method not implemented.');
  }
  constructor(@InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessageDocument>) {}

  async getAllChatMessages() {
    return this.chatMessageModel.find().exec();
  }


  async createMessage(chatId: string, senderId: string, content: string): Promise<ChatMessage> {
    const newMessage = new this.chatMessageModel({ chat_id: chatId, sender_id: senderId, content });
    return newMessage.save();
  }

  async getMessages(chatId: string): Promise<ChatMessage[]> {
    return this.chatMessageModel.find({ chat_id: chatId }).populate('sender_id').exec();
  }

  async deleteMessage(messageId: string): Promise<ChatMessage | null> {
    return this.chatMessageModel.findByIdAndDelete(messageId).exec();
  }

  // async getChatMessageById(id: string) {
  //   return this.chatMessageModel.findById(id).exec();
  // }

  // async createChatMessage(data: any) {
  //   return this.chatMessageModel.create(data);
  // }

  // async deleteChatMessage(id: string) {
  //   return this.chatMessageModel.findByIdAndDelete(id).exec();
  // }



}
