import { Injectable, NotFoundException ,BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Courses } from './models/courses.schema';
import { Student } from '../student/models/student.Schema'
import { Modules } from '../modules/models/modules.schema';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create.course.dto';
import { UpdateCourseDto } from './dto/update.course.dto';
@Injectable()
export class CoursesService {
    constructor(
        @InjectModel(Courses.name) private courseModel: mongoose.Model<Courses>,
        @InjectModel(Modules.name) private readonly moduleModel: Model<Modules>,
        @InjectModel(Student.name) private readonly studentModel : Model<Student>
    ) { }
    private calculateAverageRating(ratings: number[]): number {
        const sum = ratings.reduce((acc, rating) => acc + rating, 0);
        return sum / ratings.length;
      }
      //create thread w forum
    async create(createCourseDto: CreateCourseDto): Promise<Courses> {
        const newCourse = new this.courseModel(createCourseDto);

        return newCourse.save();
      }

      async update(courseId: string , updateCourseDto: UpdateCourseDto,
      ): Promise<Courses> {
        if (updateCourseDto.keywords) {
          updateCourseDto.keywords = updateCourseDto.keywords.map(keyword => keyword.toLowerCase());
      }
        const updatedCourse = await this.courseModel.findByIdAndUpdate(
          courseId, updateCourseDto,{ new: true },);
        if (!updatedCourse) {
          throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        return updatedCourse;
      }

      async delete(courseId: string) {
       // Check if any students are enrolled in the course
        const enrolledStudents = await this.studentModel.findOne({ enrolled_courses: courseId });
        if (enrolledStudents) {
          throw new BadRequestException(`Cannot delete course with ID ${courseId} because students are enrolled.`);
        }
      
        // Delete all modules associated with the course
        const modulesResult = await this.moduleModel.deleteMany({ course_id: courseId });
        console.log(`${modulesResult.deletedCount} modules deleted`);

         // Delete the course itself
        const courseResult = await this.courseModel.deleteOne({ _id: courseId });
        if (courseResult.deletedCount === 0) {
          throw new NotFoundException(`Course with ID ${courseId} not found.`);
        }

        return `Course with ID ${courseId} deleted successfully`;
      }

      async getAllCourses(): Promise<Courses[]> {
        return this.courseModel.find().select('-ratings -created_by');
      }
      
      async getCourseById(courseId: string): Promise<Courses> {
        const course = await this.courseModel.findById(courseId).select('-ratings -created_by').exec();
        if (!course) {
          throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        return course;
      }

      async findAll(): Promise<Courses[]> {
          return this.courseModel.find();
      }

      async findOne(courseId: string): Promise<Courses> {
          const course = await this.courseModel.findById(courseId);
          if (!course) {
          throw new NotFoundException(`Course with ID ${courseId} not found`);
          }
          return course;
      }


 async updateRating(courseId: string, newRating: number): Promise<Courses> {
            const course = await this.courseModel.findById(courseId);
            if (!course) {
              throw new NotFoundException(`Course with ID ${courseId} not found`);
            }
        
            // Add the new rating to the ratings array
            course.ratings.push(newRating);
        
            // Recalculate the average rating
            const averageRating = this.calculateAverageRating(course.ratings);
            
            // Update the course with the new average rating
            course.rating = averageRating;
            await course.save();
        
 return course;
}

async searchByKeywords(keywords: string[]): Promise<Courses[]> {
  const lowerCaseKeywords = keywords.map(keyword => keyword.toLowerCase());
  const courses = await this.courseModel.find({
 keywords: { $in: lowerCaseKeywords },}).exec();
            if (!courses.length) {
              throw new NotFoundException('No courses found with the given keywords');
            }
            return courses;
}
async searchByKeywordsForStudents(keywords: string[]): Promise<Courses[]> {
  const lowerCaseKeywords = keywords.map(keyword => keyword.toLowerCase());
            const courses = await this.courseModel
              .find({
                keywords: { $in: lowerCaseKeywords },
              })
              .select('-ratings -created_by') // Exclude ratings and created_by fields
              .exec();
          
            if (!courses.length) {
              throw new NotFoundException('No courses found with the given keywords');
            }
          
            return courses;
}
          

}