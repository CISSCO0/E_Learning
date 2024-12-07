import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';

@WebSocketGateway({ cors: true }) // Enable CORS for cross-origin communication
export class MessageGateway {
  @WebSocketServer()
  server: Server; // The Socket.IO server instance

  constructor(private readonly messageService: MessageService) {}

  // Handle a client joining a chat room
  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(chatId); // Add the client to the specified chat room
    console.log(`Client ${client.id} joined chat: ${chatId}`);
  }

  // Handle sending a message
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: { content: string; chatId: string; senderId: string },
  ) {
    // Save the message to the database
    const message = await this.messageService.createMessage(
      data.chatId,
      data.senderId,
      data.content,
    );

    // Broadcast the new message to all users in the chat room
    this.server.to(data.chatId).emit('newMessage', message);

    return message; // Optional: Send acknowledgment back to the sender
  }
}
