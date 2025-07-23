import { Module ,forwardRef} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThreadController } from './threads.controller';
import { ThreadService } from './threads.services';
import { Thread, ThreadSchema } from './models/threads.schema'

import { ForumModule } from 'src/forum/forum.module';
import { Forum, ForumSchema } from 'src/forum/models/forums.schema';
//import { ForumModule } from 'src/Forums/forum.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Thread.name, schema: ThreadSchema },
      {name: Forum.name, schema: ForumSchema}]),
    // MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    // MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  forwardRef(() => ForumModule ),
  ],
  controllers: [ThreadController],
  providers: [ThreadService],
})
export class ThreadModule {}
