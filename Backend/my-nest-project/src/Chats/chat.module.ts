import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat, ChatSchema } from '../Chats/models/chat.schema';
import { Message, MessageSchema } from '../messages/models/messeageSchema';
import { Users ,UserSchema } from 'src/user/models/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]), // Add Users schema
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
