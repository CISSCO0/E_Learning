import { Module ,forwardRef} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThreadController } from './thread.controller';
import { ThreadService } from './thread.service';
import { Thread, ThreadSchema } from '../Threads/models/Thread.schema';
import { ChatMessage } from '../chatMessages/models/chatMessages.schema'
import { ForumModule } from 'src/forum/forum.module';
import { Forum } from 'src/forum/models/forums.schema';
//import { ForumModule } from 'src/Forums/forum.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Thread.name, schema: ThreadSchema },
      {name: Forum.name, schema: ForumModule}]),
    // MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    // MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  forwardRef(() => ForumModule ),
  ],
  controllers: [ThreadController],
  providers: [ThreadService],
})
export class ThreadModule {}
