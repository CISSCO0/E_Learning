import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThreadMessageService } from './threadMessages.services';
import { ThreadMessageController } from './threadMessages.controller';
import { ThreadMessage, ThreadMessageSchema } from './models/threadMessages.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ThreadMessage.name, schema: ThreadMessageSchema }]),
  ],
  controllers: [ThreadMessageController],
  providers: [ThreadMessageService],
})
export class ThreadMessageModule {}
