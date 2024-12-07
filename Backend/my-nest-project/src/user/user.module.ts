import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from './models/users.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AdminModule } from 'src/admin/admin.module';
import { InstructorModule } from 'src/instructor/instructor.module';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
    forwardRef(() =>StudentModule),
    forwardRef(() =>InstructorModule),
    forwardRef(() =>AdminModule)
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
