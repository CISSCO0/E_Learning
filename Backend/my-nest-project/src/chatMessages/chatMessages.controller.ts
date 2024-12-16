import { Controller, Get, Post, Param, Delete, Body, UseGuards } from '@nestjs/common';
import { ChatMessageService } from './chatMessages.services';
import { ChatMessage } from './models/chatMessages.schema';
import { Role, Roles } from '../auth/decorators/roles.decorator';
import { Public} from '../auth/decorators/public.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
import { AuthGuard} from '../auth/guards/authentication.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { Chat } from 'src/Chats/models/chat.schema';

@Controller('chat-messages')
@UseGuards(AuthGuard, Roles) // Apply JWT and roles guards globally to all routes
export class ChatMessageController {
  constructor(private chatMessageService: ChatMessageService) {}

  @Get()
  
  getAllChatMessages() {
    return this.chatMessageService.getAllChatMessages();
  }

  // @Get(':id')
  // getChatMessageById(@Param('id') id: string) {
  //   return this.chatMessageService.getChatMessageById(id);
  // }

  @Get(':chatId')

  @Roles(Role.Student, Role.Instructor) // Students and instructors can view messages in a chat
  
    async getMessages(@Param('chatId') chatId: string): Promise<ChatMessage[]> {
      return this.chatMessageService.getMessages(chatId);
    }



    
  @Post()

  @Roles(Role.Student, Role.Instructor) // Students and instructors can create messages
 
   async createMessage(@Body() createMessageDto: CreateMessageDto): Promise<ChatMessage> {
     return this.chatMessageService.createMessage(createMessageDto.chatId, createMessageDto.senderId, createMessageDto.content);
   }



    
  @Delete(':messageId')
  @Roles(Role.Student, Role.Instructor) // Only authorized roles can delete messages
   async deleteMessage(@Param('messageId') messageId: string): Promise<ChatMessage> {
     const deletedMessage = await this.chatMessageService.deleteMessage(messageId);
     if (!deletedMessage) {
       throw new Error('Message not found or already deleted');
     }
     return deletedMessage;
   }


   
  

  // @Post()
  // createChatMessage(@Body() data: any) {
  //   return this.chatMessageService.createChatMessage(data);
  // }

  // @Delete(':id')
  // deleteChatMessage(@Param('id') id: string) {
  //   return this.chatMessageService.deleteChatMessage(id);
  // }

}
