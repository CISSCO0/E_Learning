import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThreadController } from './thread.controller';
import { ThreadService } from './thread.service';
import { Thread, ThreadSchema } from '../Threads/models/Thread.schema';
import { Message, MessageSchema } from '../messages/models/messeageSchema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Thread.name, schema: ThreadSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [ThreadController],
  providers: [ThreadService],
})
export class ThreadModule {}
