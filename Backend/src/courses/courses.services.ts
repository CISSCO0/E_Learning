import { Injectable, NotFoundException ,BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Courses } from './models/courses.schema';
import { Student } from '../student/models/student.Schema'
import { Modules } from '../modules/models/modules.schema';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create.course.dto';
import { UpdateCourseDto } from './dto/update.course.dto';
import { Instructor } from 'src/instructor/models/instructorSchema';
import { error } from 'console';
import * as fs from 'fs'; // File system module to write files
import * as path from 'path'; // Path module to work with file paths
@Injectable()
export class CoursesService {
    constructor(
        @InjectModel(Courses.name) private courseModel: mongoose.Model<Courses>,
        @InjectModel(Modules.name) private readonly moduleModel: Model<Modules>,
        @InjectModel(Student.name) private readonly studentModel : Model<Student>,
        @InjectModel(Instructor.name) private readonly instructorModel : Model<Instructor>
    ) { }
    
    private ratedUsersSet = new Set();
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
      async getStudentsByCourse(courseId: string): Promise<Student[]> {
        return this.studentModel.find({ enrolled_courses: courseId }).exec();
      }

    async chats(courseId: string): Promise<string[]> {
      // Fetch the course and ensure it exists
      const course = await this.courseModel.findById(courseId).exec();
      if (!course) {
        throw new Error('Course not found');
      }
      // console.log('Course:', course);
    //console.log(course.created_by)
      // Get the instructor's userId
      const instructor = await this.instructorModel
        .findById(course.created_by) // Use findOne for a single result
        .select('user_id') // Select only the `user_id` field
        .exec();
    
      if (!instructor) {
        throw new Error('Instructor not found');
      }
    //  console.log('Instructor:', instructor);
    
      // Fetch all students and map their userIds
      const students = 
      await this.studentModel
        .find({ enrolled_courses: courseId }) // Match enrolled courses
        .select('user_id') // Select only the `user_id` field
        .exec();
    
      //c//onsole.log('Students:', students);
    
      // Combine the instructor's userId and the students' userIds
      const instructorUserId = instructor.user_id;
      return [instructorUserId.toString(), ...students.map(student => student.user_id)];
    }
    async findByInstructorId(instructorId: string): Promise<Courses[]> {
      return this.courseModel.find({ created_by: instructorId }).exec();
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
  console.log("okk")
  const courses = await this.courseModel.find({
 keywords: { $in: lowerCaseKeywords },}).exec();
            // if (!courses.length) {
            //   throw new NotFoundException('No courses found with the given keywords');
            // }
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
async addRating(courseId, newRating, userId) {
  // Check if the user has already rated
  if (this.ratedUsersSet.has(userId)) {
    throw new Error("you hadve rated before");
  } else {
      // Fetch the course by ID
      const course = await this.courseModel.findById(courseId);// Fetch course logic
      if (!course) {
          throw new Error(`Course with ID ${courseId} not found`);
      }

      this.ratedUsersSet.add(userId);
      // Add the new rating to the ratings array
      course.ratings.push(newRating);

      // Recalculate the average rating
      course.rating = this.calculateAverageRating(course.ratings);

      // Save the updated course
      course.save() ;


      return course; // Return the updated course
  }
}
async generateAllCoursesReport(): Promise<string> {
  // Fetch all courses
  const allCourses = await this.courseModel.find().exec();
  if (!allCourses || allCourses.length === 0) {
    throw new Error('No courses found');
  }

  // Prepare headers for the report
  const headers = ['Course Title', 'Module Title', 'Module Rating', 'Course Rating'];

  // Initialize rows
  const rows: string[] = [];

  for (const course of allCourses) {
    // Fetch modules for the current course
    const modules = await this.moduleModel.find({ course_id: course._id }).exec();
    
    if (!modules.length) {
      // Handle case where course has no modules
      rows.push(`${course.title}, No Modules, N/A, N/A`);
      continue;
    }

    // Calculate the course rating (average of module ratings)
    const moduleRatings = modules.map(module => module.rating);
    const courseRating = this.calculateAverageRating(moduleRatings);

    // Add rows for each module in the course
    for (const module of modules) {
      rows.push(`${course.title}, ${module.title}, ${module.rating}, ${courseRating}`);
    }
  }

  // Combine headers and rows
  const reportData = [headers.join(','), ...rows].join('\n');

  // Save the report to a file
  const reportFilePath = path.join(__dirname, `all_courses_analytics_report.csv`);
  fs.writeFileSync(reportFilePath, reportData);

  return reportFilePath; // Return the file path for download
}


// Function to clean up the report file after download
async deleteReportFile(filePath: string) {
  fs.unlinkSync(filePath);
}
   

}