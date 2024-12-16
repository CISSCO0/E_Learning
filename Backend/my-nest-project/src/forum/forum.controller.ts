import { Controller, Get, Post, Param, Delete, Body, Put, UseGuards } from '@nestjs/common';
import { ForumService } from './forum.services';
import { Forum } from './models/forums.schema';
import { Role, Roles } from '../auth/decorators/roles.decorator';
import { Public} from '../auth/decorators/public.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
import { AuthGuard} from '../auth/guards/authentication.guard';

@Controller('forums')
@UseGuards(AuthGuard, Roles) // Apply authentication and role-based authorization guards globally to all routes

export class ForumController {
  constructor(private forumService: ForumService) {}

  @Get()
  getAllForums() {
    return this.forumService.getAllForums();
  }

  @Get(':id')
  @Roles(Role.Student, Role.Instructor)
  getForumById(@Param('id') id: string) {
    return this.forumService.getForumById(id);
  }
  
  @Get(':courseId')
  @Roles(Role.Student, Role.Instructor)
  async getForumByCourse(@Param('courseId') courseId: string): Promise<Forum> {
      return this.forumService.getForumByCourse(courseId);
  }

  @Post()
  @Roles(Role.Student, Role.Instructor)
  createForum(@Body() data: any) {
    return this.forumService.createForum(data);
  }

  @Put(':id')
  @Roles(Role.Student, Role.Instructor)
  updateForum(@Param('id') id: string, @Body() updateData: any) {
    return this.forumService.updateForum(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.Instructor, Role.Admin) 
  deleteForum(@Param('id') id: string) {
    return this.forumService.deleteForum(id);
  }

  @Delete(':courseId')
  @Roles(Role.Instructor, Role.Admin) 
  async delete(@Param('courseId') courseId: string): Promise<void> {
    try {
      await this.forumService.delete(courseId);  // Call the delete method from the service
    }catch (error) {
      throw new error (`Forum with courseId ${courseId} not found.`);
    }
  }
}
