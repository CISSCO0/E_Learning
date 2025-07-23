import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './models/chat.schema';
import { CreateChatDto } from './dto/createChat.dto';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async getAllChats() {
    return this.chatModel.find().exec();
  }
  async getChatsByCourseId(courseId: string): Promise<Chat[]> {
    try {
      return await this.chatModel.find({ courseId }).exec();
    } catch (error) {
      throw new Error(`Failed to fetch chats for courseId ${courseId}: ${error.message}`);
    }
  }
  async getChatById(id: string) {
    return this.chatModel.findById(id).exec();
  }
  async createChat(createChatDto: CreateChatDto, userId: string): Promise<Chat> {
    // Set the current date if not provided
    const date = createChatDto.date || new Date();
  
    // Ensure the userId is included in the users array
    const users = createChatDto.users.includes(userId)
      ? createChatDto.users
      : [...createChatDto.users, userId];
  
    // Create a new chat object with the provided data, updated users, and current date
    const createdChat = new this.chatModel({
      ...createChatDto,
      users,
      date,
    });
  
    return createdChat.save();
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
