import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumService } from './forum.services';
import { ForumController } from './forum.controller';
import { Forum, ForumSchema } from './models/forums.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Forum.name, schema: ForumSchema }],),
  ],
  controllers: [ForumController],
  providers: [ForumService],
})
export class ForumModule {}
