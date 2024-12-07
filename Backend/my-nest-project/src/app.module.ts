import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService
import { MongooseModule } from '@nestjs/mongoose';
import { ResponsesModule } from './responses/response.module';
import { QuestionsModule } from './questions/questions.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizzesModule } from './quizzes/quizzes.module';
import { QuestionBankModule } from './questionBank/questionBank.module';
import { ModuleProgressModule } from './moduleProgress/moduleProgress.module';
import { CourseModule } from './courses/courses.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
    }),
    // Use MongooseModule with ConfigService to read the MONGO_URI
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    ResponsesModule,
    QuestionsModule,
    QuizzesModule,
    QuestionBankModule,
    ModuleProgressModule,
    CourseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}