import { Controller, Post, Get, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './models/messeageSchema';
import { Role, Roles } from '../auth/decorators/roles.decorator';
import { Public} from '../auth/decorators/public.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
import { AuthGuard} from '../auth/guards/authentication.guard';

@Controller('messages')
@UseGuards(AuthGuard, Roles) // Apply JWT and roles guards globally to all routes

export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()

 @Roles(Role.Student, Role.Instructor) // Students and instructors can create messages

  async createMessage(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
    return this.messageService.createMessage(createMessageDto.chatId, createMessageDto.senderId, createMessageDto.content);
  }

  @Get(':chatId')

@Roles(Role.Student, Role.Instructor) // Students and instructors can view messages in a chat

  async getMessages(@Param('chatId') chatId: string): Promise<Message[]> {
    return this.messageService.getMessages(chatId);
  }


  @Delete(':messageId')
 @Roles(Role.Student, Role.Instructor) // Only authorized roles can delete messages
  async deleteMessage(@Param('messageId') messageId: string): Promise<Message> {
    const deletedMessage = await this.messageService.deleteMessage(messageId);
    if (!deletedMessage) {
      throw new Error('Message not found or already deleted');
    }
    return deletedMessage;
  }
// // error handling
//   async deleteMessage(messageId: string): Promise<Message> {
//     const deletedMessage = await this.messageModel.findByIdAndDelete(messageId).exec();
//     if (!deletedMessage) {
//       throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
//     }
//     return deletedMessage;
//   }
}
