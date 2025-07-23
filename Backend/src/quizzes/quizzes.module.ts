import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { QuizzesSchema } from './models/quizzes.schema';
import { QuestionBankModule } from 'src/questionBank/questionBank.module';
import { ResponsesModule } from 'src/responses/response.module'; // Assuming you have a response module
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Quizzes', schema: QuizzesSchema }]),
    QuestionBankModule,
    ResponsesModule,
    QuestionsModule
  ],
  providers: [QuizzesService],
  controllers: [QuizzesController],
  exports: [QuizzesService]
})
export class QuizzesModule {}
