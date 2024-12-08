import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from '../Chats/models/chat.schema';
import { Message } from '../messages/models/messeageSchema'
import { CreateChatDto } from './dto/create-chat.dto';
import { Users } from 'src/user/models/users.schema'; 

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Users.name) private userModel:Model<Users>
  ) {}

  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    const { users, title } = createChatDto;
  

    
    if (users.length < 2) {
      throw new Error('A chat must have at least two users.');
    }
  
    let chatTitle = title;
  
    if (!title) {
      if (users.length === 2) {
        // Fetch the names of the users
        const userDocs: Users[] = (await this.userModel.find({ _id: { $in: users } }).exec())
        chatTitle = userDocs[0].name; // Assuming you fetch both users and pick the other's name
      } else {
        chatTitle = 'Group Chat';
      }
    }
  
    const newChat = new this.chatModel({
      users,
      messages: [],
      title: chatTitle,
    });
  
    return newChat.save();
  }

  


  async searchChats(query: string): Promise<Chat[]> {
    const regex = new RegExp(query, 'i'); // Case-insensitive search
    return this.chatModel.find({ title: { $regex: regex } }).populate('users', 'messages').exec();
  }
  
  

  async getChats(): Promise<Chat[]> {
    return this.chatModel.find().populate('users','messages').exec();
  }

  async getChatById(id: string): Promise<Chat> {
    const chat = await this.chatModel.findById(id).populate('users','messages').exec();
    if (!chat) throw new NotFoundException(`Chat with ID ${id} not found`);
    return chat;
  }

  async updateChat(id: string, users: string[]): Promise<Chat> {
    const updatedChat = await this.chatModel.findByIdAndUpdate(id, { users }, { new: true }).exec();
    if (!updatedChat) throw new NotFoundException(`Chat with ID ${id} not found`);
    return updatedChat;
  }

  async deleteChat(id: string): Promise<void> {
    // Find the chat to ensure it exists and get its messages
    const chat = await this.chatModel.findById(id).populate('messages').exec();
  
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
  
    // Delete all messages associated with the chat
    for (const messageId of chat.messages) {
      await this.messageModel.findByIdAndDelete(messageId).exec();
    }
  
    // Delete the chat itself
    await this.chatModel.findByIdAndDelete(id).exec();
  }

  async addMessage(chatId: string, senderId: string, content: string): Promise<Message> {
    const newMessage = new this.messageModel({ chat_id: chatId, sender_id: senderId, content });
    const message = await newMessage.save();
    await this.chatModel.findByIdAndUpdate(chatId, { $push: { messages: message._id } }).exec();
    return message;
  }

}
