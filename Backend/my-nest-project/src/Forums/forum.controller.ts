import { Controller, Post, Get, Param, Body, Put, Delete, UseGuards, BadRequestException, NotFoundException } from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreateForumDto } from './dto/create-forum.dto';
import { Forum } from './models/forum.schema';
import { CreateThreadDto } from 'src/Threads/dto/create-thread.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { Role, Roles } from '../auth/decorators/roles.decorator';
import { Public} from '../auth/decorators/public.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
import { AuthGuard} from '../auth/guards/authentication.guard';

@Controller('forums')
@UseGuards(AuthGuard, Roles) // Apply authentication and authorization guards

export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post()

  @Roles(Role.Instructor, Role.Admin) // Only instructors and admins can create forums

  async createForum(@Body() createForumDto: CreateForumDto): Promise<Forum> {
    return this.forumService.createForum(createForumDto.courseId, createForumDto.instructorId);
  }
  

  @Post(':forumId/threads')
  async addThreadToForum(
    @Param('forumId') forumId: string,
    @Body('title') threadTitle: string,
  ) {
    return this.forumService.addThreadToForum(forumId, threadTitle);
  }

  @Delete(':forumId/threads/:threadId')
  async deleteThreadFromForum(
    @Param('forumId') forumId: string,
    @Param('threadId') threadId: string,
  ) {
    return this.forumService.deleteThreadFromForum(forumId, threadId);
  }

  @Get(':courseId')

  @Roles(Role.Student, Role.Instructor) // Students and instructors can view the forum by course

  async getForumByCourse(@Param('courseId') courseId: string): Promise<Forum> {
    return this.forumService.getForumByCourse(courseId);
  }

  @Get(':courseId/threads')

  @Roles(Role.Student, Role.Instructor) // Students and instructors can view threads for a course

  async getThreads(@Param('courseId') courseId: string) {
    return await this.forumService.getThreads(courseId);
  } 

  @Get()

 @Roles(Role.Admin, Role.Instructor) // Only admins and instructors can view all forums

  async getAllForums() {
    return await this.forumService.getAllForums();
  }

  @Delete(':id')

  @Roles(Role.Admin) // Only admins can delete forums

  async deleteForum(@Param('id') id: string): Promise<void> {
    return this.forumService.deleteForum(id);
  }


  @Get(':forumId')

 @Roles(Role.Student, Role.Instructor) // Students and instructors can view a forum by its ID

  async getForum(@Param('forumId') Forum: string) {
    return this.forumService.findById(Forum);
  }

   //Endpoint to delete a forum by courseId
   @Delete(':courseId')
   async delete(@Param('courseId') courseId: string): Promise<void> {
     try {
       await this.forumService.delete(courseId);  // Call the delete method from the service
     } catch (error) {
       if (error instanceof BadRequestException) {
         throw error;  // If error is a BadRequestException, throw it
       }
       throw new NotFoundException(`Forum with courseId ${courseId} not found.`);
     }
   }
}

