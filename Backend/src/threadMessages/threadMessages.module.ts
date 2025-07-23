import { Module,forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThreadMessageService } from './threadMessages.services';
import { ThreadMessageController } from './threadMessages.controller';
import { ThreadMessage, ThreadMessageSchema } from './models/threadMessages.schema';
import { ThreadModule } from '../thread/threads.module';
import { Thread} from 'src/thread/models/threads.schema'

@Module({
 imports: [
   MongooseModule.forFeature([{ name: ThreadMessage.name, schema: ThreadMessageSchema },
    {name: Thread.name, schema:ThreadModule }
   ]), 
   forwardRef(() => ThreadModule  ),
  ],
  controllers: [ThreadMessageController],
  providers: [ThreadMessageService],
})
 export class ThreadMessageModule {}
