import { Module,forwardRef } from '@nestjs/common';
import { ProgressController } from './progress.controllers';
import { ProgressService } from './progress.sevices';
import { MongooseModule } from '@nestjs/mongoose';
import { Progress, ProgressSchema } from './models/progress.schema'; // Adjust with the correct file path
import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
import { AuthGuard } from '../auth/guards/authentication.guard';
import { AuthModule } from '../auth/auth.module';
import { StudentModule } from 'src/student/student.module';
import { ModulesModule } from 'src/modules/modules.module';
import { Student,StudentSchema } from 'src/student/models/student.Schema';
import { Modules,ModulesSchema } from 'src/modules/models/modules.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema },
      { name: Student.name, schema: StudentSchema},
      { name: Modules.name, schema:ModulesSchema }

    ]),
     // For MongoDB integration
     forwardRef(() => StudentModule),
     forwardRef(() => ModulesModule),
    AuthModule
  ],
  controllers: [ProgressController],
  providers: [ProgressService,AuthorizationGuard, AuthGuard ],
})
export class ProgressModule {}
