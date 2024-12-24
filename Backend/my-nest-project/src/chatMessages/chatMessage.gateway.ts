import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessageService } from './chatMessages.services';

@WebSocketGateway({ cors: true })
export class ChatMessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatMessageService: ChatMessageService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Handle message broadcasting
  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: any) {
    const { chatId, senderId, content, date } = payload;

    // Save message to database
    const newMessage = await this.chatMessageService.createMessage(senderId,{
      chatId,
      content,
      senderId
     // date: new Date(date),
    });

    // Broadcast the message to all connected clients
    this.server.emit('receiveMessage', newMessage);
  }

  // Retrieve chat messages for a chat ID
  @SubscribeMessage('getChatMessages')
  async handleGetChatMessages(client: Socket, chatId: string) {
    const messages = await this.chatMessageService.getAllChatMessages();
    client.emit('chatMessages', messages.filter((msg) => msg.chatId === chatId));
  }
}
