import { Controller, Get, Post, Param, Delete, Body, UseGuards } from '@nestjs/common';
import { ThreadMessageService } from './threadMessages.services';
import { Role, Roles } from '../auth/decorators/roles.decorator';
import { Public} from '../auth/decorators/public.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
import { AuthGuard} from '../auth/guards/authentication.guard';

@Controller('thread-messages')
@UseGuards(AuthGuard, Roles) // Apply authentication and role-based authorization guards globally to all routes

export class ThreadMessageController {
  constructor(private threadMessageService: ThreadMessageService) {}

  @Get()
  getAllThreadMessages() {
    return this.threadMessageService.getAllThreadMessages();
  }

  @Get(':id')
  @Roles(Role.Instructor, Role.Student) // Both instructors and students can get threadmessage 

  getThreadMessageById(@Param('id') id: string) {
    return this.threadMessageService.getThreadMessageById(id);
  }
  @Get('thread/:id')
  @Roles(Role.Instructor, Role.Student)

  async getMessages(@Param('id') threadId: string){
    return this.threadMessageService.getMessages(threadId);
  }


  @Post()
  @Roles(Role.Instructor, Role.Student)
  createThreadMessage(@Param('id')id,@Body() data: any) {
    return this.threadMessageService.createThreadMessage(id,data);
  }


  @Delete(':id')
  @Roles(Role.Instructor, Role.Admin) 
  deleteThreadMessage(@Param('id') id: string) {
    return this.threadMessageService.deleteThreadMessage(id);
  }
}
