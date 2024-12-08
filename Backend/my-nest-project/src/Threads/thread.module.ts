import { Module ,forwardRef} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThreadController } from './thread.controller';
import { ThreadService } from './thread.service';
import { Thread, ThreadSchema } from '../Threads/models/Thread.schema';
import { Message, MessageSchema } from '../messages/models/messeageSchema';
import { ForumModule } from 'src/Forums/forum.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Thread.name, schema: ThreadSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ForumModule,
  ],
  controllers: [ThreadController],
  providers: [ThreadService],
})
export class ThreadModule {}
