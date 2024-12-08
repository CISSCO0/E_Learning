import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThreadService } from './threads.services';
import { ThreadController } from './threads.controller';
import { Thread, ThreadSchema } from './models/threads.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Thread.name, schema: ThreadSchema }]),
  ],
  controllers: [ThreadController],
  providers: [ThreadService],
})
export class ThreadModule {}
