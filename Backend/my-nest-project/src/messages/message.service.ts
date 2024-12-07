import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './models/messeageSchema';

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>) {}

  async createMessage(chatId: string, senderId: string, content: string): Promise<Message> {
    const newMessage = new this.messageModel({ chat_id: chatId, sender_id: senderId, content });
    return newMessage.save();
  }

  async getMessages(chatId: string): Promise<Message[]> {
    return this.messageModel.find({ chat_id: chatId }).populate('sender_id').exec();
  }

  async deleteMessage(messageId: string): Promise<Message | null> {
    return this.messageModel.findByIdAndDelete(messageId).exec();
  }
  
}

