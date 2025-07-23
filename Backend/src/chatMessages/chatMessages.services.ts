import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage, ChatMessageDocument } from './models/chatMessages.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { Chat, ChatDocument } from 'src/chat/models/chat.schema';

@Injectable()
export class ChatMessageService {
  constructor(@InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessageDocument>,
  @InjectModel(Chat.name) private chatModel: Model<ChatDocument>, // Inject Chat model

) {}

  async getAllChatMessages() {
    return this.chatMessageModel.find().exec();
  }

  async getChatMessageById(id: string) {
    return this.chatMessageModel.findById(id).exec();
  }

  async createMessage(userId: string, createMessageDto: CreateMessageDto): Promise<ChatMessage> {
    const { content, chatId } = createMessageDto;

    const newMessage = new this.chatMessageModel({
      senderId: userId, // Automatically set the senderId from the userId
      content,
      chatId,
      date: new Date(), // Automatically set the date to the current date
    });
    const savedMessage = await newMessage.save();
    await this.chatModel.findByIdAndUpdate(
      chatId,
      { $push: { messages: String(savedMessage._id) } }, // Convert the _id to a string
      { new: true, useFindAndModify: false },
    );
  
    return savedMessage;
  }
  async deleteChatMessage(id: string) {
    return this.chatMessageModel.findByIdAndDelete(id).exec();
  }
}
