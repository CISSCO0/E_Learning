import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessageService } from './chatMessages.services';
import { ChatMessageController } from './chatMessages.controller';
import { ChatMessage, ChatMessageSchema } from './models/chatMessages.schema';
import { ChatMessageGateway } from './chatMessage.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChatMessage.name, schema: ChatMessageSchema }]),
  ],
  controllers: [ChatMessageController],
  providers: [ChatMessageService, ChatMessageGateway],
})
export class ChatMessageModule {}
