import { Controller, Get, Post, Param, Delete, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ChatMessageService } from './chatMessages.services';
import { CreateMessageDto } from './dto/create-message.dto';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
@Controller('chat-messages')
export class ChatMessageController {
  constructor(private chatMessageService: ChatMessageService) {}

  @Get()
  getAllChatMessages() {
    return this.chatMessageService.getAllChatMessages();
  }

  @Get(':id')
  getChatMessageById(@Param('id') id: string) {
    return this.chatMessageService.getChatMessageById(id);
  }

  @Post()
  // @UseGuards(AuthGuard) // Ensure the user is authenticated
  async createMessage(
    @Req() req: Request, // Access user information from the request
    @Body() createMessageDto: CreateMessageDto,
  ) {
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
    return this.chatMessageService.createMessage(userId, createMessageDto);
  }

  @Delete(':id')
  deleteChatMessage(@Param('id') id: string) {
    return this.chatMessageService.deleteChatMessage(id);
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
