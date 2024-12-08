import { Module ,forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumController } from './forum.controller';
import { ForumService } from './forum.service';
import { Forum, ForumSchema } from '../Forums/models/forum.schema'
import { Thread, ThreadSchema } from '../Threads/models/Thread.schema';
import { Message, MessageSchema } from 'src/messages/models/messeageSchema';
import { MessageModule } from 'src/messages/message.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Forum.name, schema: ForumSchema }]),
    MongooseModule.forFeature([{ name: Thread.name, schema: ThreadSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    forwardRef(() => MessageModule), // Use forwardRef to avoid circular dependency

  ],
  controllers: [ForumController],
  providers: [ForumService],
  exports: [ForumService, MongooseModule],
})
export class ForumModule {}
