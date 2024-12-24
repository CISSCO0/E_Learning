import { Controller, Get, Post, Param, Delete, Body, Put, HttpException, HttpStatus, Query, Req, UnauthorizedException } from '@nestjs/common';
import { ChatService } from './chat.services';
import { Chat } from './models/chat.schema';
import { CreateChatDto } from './dto/createChat.dto';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/:courseId')
  async getChatsByCourseId(@Param('courseId') courseId: string) {
    if (!courseId) {
      throw new HttpException('courseId is required', HttpStatus.BAD_REQUEST);
    }
    return this.chatService.getChatsByCourseId(courseId);
  }

  @Get()
  getAllChats() {
    return this.chatService.getAllChats();
  }

  @Get('chat/:id')
  getChatById(@Param('id') id: string) {
    return this.chatService.getChatById(id);
  }

  
  @Post()
  async createChat(@Body() createChatDto: CreateChatDto, @Req() req: Request): Promise<Chat> {
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
    
    return this.chatService.createChat(createChatDto,userId);
  }
  @Put(':id')
  updateChat(@Param('id') id: string, @Body() updateData: any) {
    return this.chatService.updateChat(id, updateData);
  }

  @Delete(':id')
  deleteChat(@Param('id') id: string) {
    return this.chatService.deleteChat(id);
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
  
}
