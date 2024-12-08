import { Controller, Get, Post, Param, Delete, Body, Put } from '@nestjs/common';
import { ChatService } from './chat.services';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  getAllChats() {
    return this.chatService.getAllChats();
  }

  @Get(':id')
  getChatById(@Param('id') id: string) {
    return this.chatService.getChatById(id);
  }

  @Post()
  createChat(@Body() data: any) {
    return this.chatService.createChat(data);
  }

  @Put(':id')
  updateChat(@Param('id') id: string, @Body() updateData: any) {
    return this.chatService.updateChat(id, updateData);
  }

  @Delete(':id')
  deleteChat(@Param('id') id: string) {
    return this.chatService.deleteChat(id);
  }
}
