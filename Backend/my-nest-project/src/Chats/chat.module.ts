import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat, ChatSchema } from '../Chats/models/chat.schema';
import { ChatMessage } from '../chatMessages/models/chatMessages.schema'
import { Users, UserSchema } from '../user/models/users.schema'; // Import Users


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: 'Message', schema: ChatMessage }]),//i changed message.name
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]), // Add Users schema
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
