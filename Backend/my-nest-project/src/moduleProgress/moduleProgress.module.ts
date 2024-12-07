import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleProgressController } from './moduleProgress.controller';
import { ModuleProgressService } from './moduleProgress.service';
import { ModuleProgressSchema } from './models/moduleProgress.schema';
import { ResponsesModule } from '../responses/response.module';
import { QuizzesModule } from 'src/quizzes/quizzes.module';
import { ModulesModule } from '../modules/modules.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ModuleProgress', schema: ModuleProgressSchema }]),
    ResponsesModule, // To access responses for quizzes
    ModulesModule,   // To access quizzes in a module,
  QuizzesModule
  ],
  controllers: [ModuleProgressController],
  providers: [ModuleProgressService],
  exports: [ModuleProgressService],
})
export class ModuleProgressModule {}
