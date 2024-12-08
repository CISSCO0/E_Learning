import { Controller, Get, Post, Param, Delete, Body, Put } from '@nestjs/common';
import { ForumService } from './forum.services';

@Controller('forums')
export class ForumController {
  constructor(private forumService: ForumService) {}

  @Get()
  getAllForums() {
    return this.forumService.getAllForums();
  }

  @Get(':id')
  getForumById(@Param('id') id: string) {
    return this.forumService.getForumById(id);
  }

  @Post()
  createForum(@Body() data: any) {
    return this.forumService.createForum(data);
  }

  @Put(':id')
  updateForum(@Param('id') id: string, @Body() updateData: any) {
    return this.forumService.updateForum(id, updateData);
  }

  @Delete(':id')
  deleteForum(@Param('id') id: string) {
    return this.forumService.deleteForum(id);
  }
}
