import { Controller, Get, Post, Param, Delete, Body } from '@nestjs/common';
import { ThreadMessageService } from './threadMessages.services';

@Controller('thread-messages')
export class ThreadMessageController {
  constructor(private threadMessageService: ThreadMessageService) {}

  @Get()
  getAllThreadMessages() {
    return this.threadMessageService.getAllThreadMessages();
  }

  @Get(':id')
  getThreadMessageById(@Param('id') id: string) {
    return this.threadMessageService.getThreadMessageById(id);
  }

  @Post()
  createThreadMessage(@Body() data: any) {
    return this.threadMessageService.createThreadMessage(data);
  }

  @Delete(':id')
  deleteThreadMessage(@Param('id') id: string) {
    return this.threadMessageService.deleteThreadMessage(id);
  }
}
