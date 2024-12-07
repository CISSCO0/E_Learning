import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Instructor, InstructorSchema } from './models/instructorSchema';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Instructor.name, schema: InstructorSchema }]),
  ],
  providers: [InstructorService],
  controllers: [InstructorController],
  exports: [InstructorService],
})
export class InstructorModule {}
