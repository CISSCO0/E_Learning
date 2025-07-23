import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './models/student.Schema';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    forwardRef(() => UserModule),
    forwardRef(() =>AuthModule),
  ],
  providers: [StudentService, AuthGuard, AuthorizationGuard],
  controllers: [StudentController],
  exports: [StudentService,MongooseModule],

})
export class StudentModule {}


