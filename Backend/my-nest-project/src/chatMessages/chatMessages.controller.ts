import { Controller, Get, Post, Param, Delete, Body } from '@nestjs/common';
import { ChatMessageService } from './chatMessages.services';

@Controller('chat-messages')
export class ChatMessageController {
  constructor(private chatMessageService: ChatMessageService) {}

  @Get()
  getAllChatMessages() {
    return this.chatMessageService.getAllChatMessages();
  }

  @Get(':id')
  getChatMessageById(@Param('id') id: string) {
    return this.chatMessageService.getChatMessageById(id);
  }

  @Post()
  createChatMessage(@Body() data: any) {
    return this.chatMessageService.createChatMessage(data);
  }

  @Delete(':id')
  deleteChatMessage(@Param('id') id: string) {
    return this.chatMessageService.deleteChatMessage(id);
  }
}
