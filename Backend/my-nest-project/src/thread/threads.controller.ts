import { Controller, Get, Post, Param, Delete, Body, Put } from '@nestjs/common';
import { ThreadService } from './threads.services';

@Controller('threads')
export class ThreadController {
  constructor(private threadService: ThreadService) {}

  @Get()
  getAllThreads() {
    return this.threadService.getAllThreads();
  }

  @Get(':id')
  getThreadById(@Param('id') id: string) {
    return this.threadService.getThreadById(id);
  }

  @Post()
  createThread(@Body() data: any) {
    return this.threadService.createThread(data);
  }

  @Put(':id')
  updateThread(@Param('id') id: string, @Body() updateData: any) {
    return this.threadService.updateThread(id, updateData);
  }

  @Delete(':id')
  deleteThread(@Param('id') id: string) {
    return this.threadService.deleteThread(id);
  }
}
