import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionBankSchema } from './models/questionBank.schema';
import { QuestionBankController } from './questionBank.controller';
import { QuestionBankService } from './questionBank.service';
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'QuestionBank', schema: QuestionBankSchema }]),
    forwardRef(() => QuestionsModule), // Use forwardRef to resolve circular dependency
  ],
  controllers: [QuestionBankController],
  providers: [QuestionBankService],
  exports: [MongooseModule,QuestionBankService], // Export only the service
})
export class QuestionBankModule {}
