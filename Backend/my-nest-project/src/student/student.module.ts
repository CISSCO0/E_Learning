import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './models/student.Schema';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { InstructorModule } from 'src/instructor/instructor.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
  ],
  providers: [StudentService],
  controllers: [StudentController],
  exports: [StudentService,MongooseModule],
})
export class StudentModule {}
