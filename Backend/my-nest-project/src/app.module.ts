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
import { AuthModule } from './auth/auth.module';
import { InstructorModule } from './instructor/instructor.module';
import { ModulesModule } from './modules/modules.module';
import { NotesModule } from './notes/notes.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ResourcesModule } from './resources/resources.module';
import { StudentModule } from './student/student.module';
import { UserModule } from './user/user.module';
import { ThreadModule } from './Threads/thread.module';
import { MessageModule } from './messages/message.module';
import { ForumModule } from './Forums/forum.module';
import { ChatModule } from './Chats/chat.module';

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
    CourseModule,
    AuthModule,
    ConfigModule,
    InstructorModule,
    ModulesModule,
    NotesModule,
    NotificationsModule,
    ResourcesModule,
    StudentModule,
    UserModule,
    ThreadModule,
    MessageModule,
    ForumModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}