import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Instructor, InstructorSchema } from './models/instructorSchema';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Instructor.name, schema: InstructorSchema }]),
    forwardRef(() =>UserModule),
    forwardRef(() =>AuthModule),
  ],
  providers: [InstructorService, AuthGuard, AuthorizationGuard],
  controllers: [InstructorController],
  exports: [InstructorService,MongooseModule],
})
export class InstructorModule {}
