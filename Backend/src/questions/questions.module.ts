import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { QuestionSchema } from './models/questions.schema';
import { ResponsesModule } from '../responses/response.module';
import { QuestionBankModule } from 'src/questionBank/questionBank.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Question', schema: QuestionSchema }]),
    forwardRef(() => ResponsesModule),
    forwardRef(() => QuestionBankModule), // Use forwardRef to resolve circular dependency
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [MongooseModule,QuestionsService], // Export only the service
})
export class QuestionsModule {}
