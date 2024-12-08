import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from './models/users.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AdminModule } from 'src/admin/admin.module';
import { InstructorModule } from 'src/instructor/instructor.module';
import { StudentModule } from 'src/student/student.module';
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
    forwardRef(() =>StudentModule),
    forwardRef(() =>InstructorModule),
    forwardRef(() =>AdminModule),
    forwardRef(() =>AuthModule)
  ],

  providers: [UserService, AuthGuard, AuthorizationGuard],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
