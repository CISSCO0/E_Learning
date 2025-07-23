import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { ThreadModule } from './thread/threads.module';
import { ForumModule } from './forum/forum.module';
import { ChatModule } from './chat/chat.modules';
import { ThreadMessageModule } from './threadMessages/threadMessages.module';
import { ChatMessageModule } from './chatMessages/chatMessages.module';
import { ProgressModule } from './progress/progress.module';
import { AdminModule } from './admin/admin.module';
import { LogsModule } from './Log/logs.module';
import { BackupService } from './backup/backup.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BackupModule } from './backup/backup.module';

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
    ScheduleModule.forRoot(),

    // Modules
    ResponsesModule,
    QuestionsModule,
    QuizzesModule,
    QuestionBankModule,
    ModuleProgressModule,
    CourseModule,
    AuthModule,
    InstructorModule,
    ModulesModule,
    NotesModule,
    NotificationsModule,
    ResourcesModule,
    AdminModule,
    StudentModule,
    UserModule,
    ThreadModule,
    ThreadMessageModule,
     ChatModule,
    ChatMessageModule,
     ForumModule,
    LogsModule,
    BackupModule,
    ProgressModule
  ],
  controllers: [AppController],  // Only AppController should be here
  providers: [AppService, BackupService],
})
export class AppModule {}
