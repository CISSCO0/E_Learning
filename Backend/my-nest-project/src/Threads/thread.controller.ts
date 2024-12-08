import { Controller, Post, Get, Param, Body, Delete, Patch, Query, Put, UseGuards, BadRequestException } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { Thread } from './models/Thread.schema';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { CreateThreadForForumDto } from './dto/create-thread-for-forum.dto';
import { Role, Roles } from '../auth/decorators/roles.decorator';
import { Public} from '../auth/decorators/public.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
import { AuthGuard} from '../auth/guards/authentication.guard';
import { Message } from 'src/messages/models/messeageSchema';


@Controller('threads')
@UseGuards(AuthGuard, Roles) // Apply authentication and role-based authorization guards globally to all routes

export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}
  
  // @Post()
  // async createThread(@Body('title') title: string) {
  //   return this.threadService.createThread(title);
  // }

  @Post()
  @Roles(Role.Instructor, Role.Admin) // Only instructors and admins can create threads

  async createThread(@Body() createThreadDto: CreateThreadDto): Promise<Thread> {
    return this.threadService.createThread(createThreadDto.title, createThreadDto.messages);
  }
   
  @Post(':forumId')
  @Roles(Role.Instructor, Role.Student) // Both instructors and students can create threads in a forum

async createThreadForForum(
  @Param('forumId') forumId: string,
  @Body() createThreadForForumDto: CreateThreadForForumDto,
): Promise<Thread> {
  const { title, initialMessage, senderId } = createThreadForForumDto;

  return this.threadService.createThreadForForum(forumId, {
    title,
    initialMessage,
    senderId,
  });
}


  // @Get(':id/messages')

  // @Roles(Role.Student, Role.Instructor) // Students and instructors can view messages in a thread

  // async getMessages(@Param('id') threadId: string) {
  //   return await this.threadService.getMessages(threadId);
  // }
  @Get(':id/messages')
@Roles(Role.Student, Role.Instructor) // Students and instructors can view messages in a thread
async getMessages(@Param('id') threadId: string): Promise<Message[]> {
  return this.threadService.getMessages(threadId);
}

  @Get(':id')

 @Roles(Role.Student, Role.Instructor) // Students and instructors can view a thread by ID

  async getThreadById(@Param('id') id: string): Promise<Thread> {
    return this.threadService.getThreadById(id);
  }

  @Put(':id')

  @Roles(Role.Instructor, Role.Admin) // Only instructors and admins can update threads

  async updateThread(@Param('id') id: string, @Body() updateThreadDto: UpdateThreadDto): Promise<Thread> {
    return this.threadService.updateThread(id, updateThreadDto.messages);
  }

  @Delete(':id')

 @Roles(Role.Instructor, Role.Admin) // Only instructors and admins can delete threads

  async deleteThread(@Param('id') id: string): Promise<void> {
    return this.threadService.deleteThread(id);
  }


  @Get('search')
@Roles(Role.Student, Role.Instructor, Role.Admin) // Allow all roles to search threads
async searchThreads(@Query('title') title: string): Promise<Thread[]> {
  if (!title) {
    throw new BadRequestException('Title query parameter is required');
  }
  return this.threadService.searchThreadsByTitle(title);
}

}
