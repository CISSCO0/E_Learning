import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto} from '../Chats/dto/create-chat.dto';
import{ UpdateChatDto } from '../Chats/dto/update-chat.dto';
import { Chat } from '../Chats/models/chat.schema';
import { Message } from '../messages/models/messeageSchema'
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { Role, Roles } from '../auth/decorators/roles.decorator';
import { Public} from '../auth/decorators/public.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
import { AuthGuard} from '../auth/guards/authentication.guard';
@Controller('chats')
@UseGuards(AuthGuard, AuthorizationGuard) // Apply guards to all routes in this controller

export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()

 @Public()
  async createChat(@Body() createChatDto: CreateChatDto): Promise<Chat> {
    return this.chatService.createChat(createChatDto);
  }

  @Get()

  @Roles(Role.Admin, Role.Instructor) // Only instructors and admins can view all chats

  async getChats(): Promise<Chat[]> {
    return this.chatService.getChats();
  }

  @Get(':id')

  @Roles(Role.Student, Role.Instructor) // Students and instructors can view specific chats

  async getChatById(@Param('id') id: string): Promise<Chat> {
    return this.chatService.getChatById(id);
  }

  @Get(':id/messages')

  @Roles(Role.Student, Role.Instructor) // Students and instructors can view messages in a chat

  // async getMessages(@Param('id') chatId: string) {
  //   return await this.chatService.getMessages(chatId);
  // }

  @Put(':id')

  @Roles(Role.Admin) // Only admins can update chats

  async updateChat(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto): Promise<Chat> {
    return this.chatService.updateChat(id, updateChatDto.users);
  }

  @Delete(':id')

  @Roles(Role.Admin) // Only admins can delete chats

  async deleteChat(@Param('id') id: string): Promise<void> {
    return this.chatService.deleteChat(id);
  }

  @Post(':chatId/messages')
  @Roles(Role.Student, Role.Instructor) // Students and instructors can add messages to chats

  async addMessage(
    @Param('chatId') chatId: string,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    return this.chatService.addMessage(chatId, createMessageDto.senderId, createMessageDto.content);
  }

  @Get('search/:query')
@Roles(Role.Student, Role.Instructor, Role.Admin) // All roles can search
async searchChats(@Param('query') query: string): Promise<Chat[]> {
  return this.chatService.searchChats(query);
}


}
