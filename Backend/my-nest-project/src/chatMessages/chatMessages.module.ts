import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessageService } from './chatMessages.services';
import { ChatMessageController } from './chatMessages.controller';
import { ChatMessage, ChatMessageSchema } from './models/chatMessages.schema';
import { ChatMessageGateway } from './chatMessage.gateway';
import { Chat, ChatSchema } from '../Chats/models/chat.schema'; //
@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChatMessage.name, schema: ChatMessageSchema }]),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  controllers: [ChatMessageController],
  providers: [ChatMessageService, ChatMessageGateway],
})
export class ChatMessageModule {}
