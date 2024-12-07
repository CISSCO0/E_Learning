import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesController } from './courses.controllers';
import { CoursesService } from './courses.services';
import { Courses, CoursesSchema } from './models/courses.schema';
// import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
// import { AuthGuard} from '../auth/guards/authentication.guard';
// import { APP_GUARD } from '@nestjs/core';
//import { ModulesModule } from 'src/modules/modules.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Courses.name, schema: CoursesSchema }]),
   // forwardRef(() => ModulesModule),
  //  forwardRef(() => ModulesModule),
  ],
  controllers: [CoursesController],
  providers: [
    CoursesService
    //,
    // {
    //   provide: APP_GUARD, 
    //   useClass: AuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthorizationGuard, 
    // },
  ],
  exports: [CoursesService],  
})
export class CourseModule {}
