import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseSchema } from './models/responses.schema';
import { ResponsesService } from './response.service';
import { ResponsesController } from './response.controller';
import { QuestionsModule } from 'src/questions/questions.module';
@Module({
  imports: [
    // Register Response model with Mongoose
    MongooseModule.forFeature([{ name: 'Response', schema: ResponseSchema }]),
    forwardRef(() => QuestionsModule),
  ],
  providers: [ResponsesService],
  controllers: [ResponsesController],
  exports: [MongooseModule, ResponsesService], // Export MongooseModule for "Response" and ResponsesService
})
export class ResponsesModule {}
