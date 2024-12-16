import { Controller, Get, Post, Param, Delete, Body, Put } from '@nestjs/common';
import { ForumService } from './forum.services';
import { Forum } from './models/forums.schema';

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
  
  @Get(':courseId')
  async getForumByCourse(@Param('courseId') courseId: string): Promise<Forum> {
      return this.forumService.getForumByCourse(courseId);
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

  @Delete(':courseId')
  async delete(@Param('courseId') courseId: string): Promise<void> {
    try {
      await this.forumService.delete(courseId);  // Call the delete method from the service
    }catch (error) {
      throw new error (`Forum with courseId ${courseId} not found.`);
    }
  }
}
