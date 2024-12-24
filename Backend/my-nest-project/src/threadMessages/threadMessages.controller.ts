import { Controller, Get, Post, Param, Delete, Body, Req, UnauthorizedException } from '@nestjs/common';
import { ThreadMessageService } from './threadMessages.services';
import { CreateThreadMessageDto } from './dto/creatThreadMessage.dto';
import { ThreadMessage } from './models/threadMessages.schema';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
@Controller('thread-messages')
export class ThreadMessageController {
  constructor(private threadMessageService: ThreadMessageService) {}

  @Get()
  getAllThreadMessages() {
    return this.threadMessageService.getAllThreadMessages();
  }

  @Get(':messageId')
  async findByThreadId(@Param('messageId') messageId: string): Promise<ThreadMessage> {
    return this.threadMessageService.getThreadMessageById(messageId);
  }
  @Get('thread/:id')
  async getMessages(@Param('id') threadId: string){
    return this.threadMessageService.getMessages(threadId);
  }

  @Post()
  async create(@Body() createThreadMessageDto: CreateThreadMessageDto,@Req() req: Request): Promise<ThreadMessage> {
const token = this.extractToken(req);
    
    if (!token) {
      throw new UnauthorizedException('Authentication token is required');
    }

    // Decode token to get userId
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, 'clown'); // Replace 'your-secret-key' with your JWT secret
    } catch (err) {
      console.log("no")
      throw new UnauthorizedException('Invalid or expired token');
    }
    console.log('wooo: ', decodedToken);
    const userId = decodedToken.userid;

    return this.threadMessageService.create(createThreadMessageDto,userId);
  }

  /**
     * Extracts the token from cookies or Authorization header
     * @param request - The incoming HTTP request
     * @returns The JWT token if present
     */
    private extractToken(request: Request): string | undefined {
      // Check cookies for the token
      if (request.cookies && request.cookies.token) {
        return request.cookies.token;
      }
  
      // Check Authorization header for the token
      const authHeader = request.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
      }
  
      return undefined;
    }



  @Delete(':id')
  deleteThreadMessage(@Param('id') id: string) {
    return this.threadMessageService.deleteThreadMessage(id);
  }
}
