import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress } from './models/progress.schema';
import { Student} from '../student/models/student.Schema';
import { Modules} from '../modules/models/modules.schema';
import { UpdateProgressDto } from './dto/update.dto';
import {CreateProgressDto} from './dto/create.dto'
import { StudentModule } from 'src/student/student.module';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<Progress>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Modules.name) private modulesModel: Model<Modules>,
  ) {}
  //needs to be revised 
  async registerCourse(createProgressDto: CreateProgressDto) {
    const { user_id, course_id , modulesId, performance } = createProgressDto;
  
    // Check if the student is already registered for this course
    const existingProgress = await this.progressModel.findOne({ user_id, course_id });
    if (existingProgress) {
      throw new BadRequestException('Student is already registered for this course');
    }
  
  
    // Find the student and add the course to the enrolled_courses array
    const student = await this.studentModel.findOne({ user_id });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
  
    // Check if the student is not already enrolled in this course
    if (student.enrolled_courses.includes(course_id)) {
      throw new BadRequestException('Student is already enrolled in this course');
    }
  

    student.enrolled_courses.push(course_id);
      // Create a new progress entry for the student
      const newProgress = new this.progressModel({
        user_id,
        course_id,
        completion_percentage: 0,
        last_accessed: new Date(),
        performance: performance || [],
        modulesId,
      });
    
    // Save the progress entry
    await newProgress.save();
  
    //Save the updated student
    await student.save();
  
    return newProgress;
  }
  

  async completeModule(userId: string, moduleId: string): Promise<Progress> {
    //asheel course mn enrolled courses  kman  

    // Find the progress record
    const progress = await this.progressModel.findOne({ user_id: userId });
    if (!progress) throw new Error('Progress record not found');

    // Avoid duplicate entries
    if (progress.modulesId.includes(moduleId)) return progress;

    // Add module to the array
    progress.modulesId.push(moduleId);

    // Update completion percentage
    const totalModules = await this.modulesModel.countDocuments({
      course_id: progress.course_id,
    });
    progress.completion_percentage = Math.min(
      (progress.modulesId.length / totalModules) * 100,
      100,
    );
    const student = await this.studentModel.findOne({ _id: userId });
    // Check if progress is complete
    if (progress.completion_percentage === 100) {
      if (!student) throw new Error('Student record not found');
      /// dont forget to add grade calculate by prformance array 
      student.certificates.push(`certificate-${progress.course_id}`); // Add certificate
      await student.save();
    }

    progress.last_accessed = new Date();
  // Remove the courseId from enrolled courses list
   const index = student.enrolled_courses.indexOf(progress.course_id );
  if (index !== -1) {
    student.enrolled_courses.splice(index, 1);
    await student.save();
  }
    return await progress.save();
  }
    // CREATE Progress
    async create(createProgressDto: CreateProgressDto): Promise<Progress> {
        const newProgress = new this.progressModel(createProgressDto);
        return await newProgress.save();
      }

  async getProgress(userId: string, courseId: string) {
    return this.progressModel.findOne({ user_id: userId, course_id: courseId });
  }
  async findAll():Promise<Progress[]>{
    return this.progressModel.find().exec();
  }

 async findById(id: string): Promise<Progress|null> {
    return this.progressModel.findById(id).exec();
  }
   // Update by ID
   async updateById(
    id: string,
    updateProgressDto: UpdateProgressDto,
  ): Promise<Progress | null> {
    return this.progressModel.findByIdAndUpdate(
      id,
      { $set: updateProgressDto },
      { new: true },
    ).exec();
  }
    // Delete by ID
    async deleteById(id: string): Promise<Progress| null> {
        return this.progressModel.findByIdAndDelete(id).exec();
        
      }

      private gradeMapping = {
        A: 4.0,
        B: 3.0,
        C: 2.0,
        D: 1.0,
        F: 0.0,
      };
    
      // Calculate the final grade
      async calculateFinalGrade(userId: string, courseId: string): Promise<number> {
        const progress = await this.progressModel.findOne({ user_id: userId, course_id: courseId });
    
        if (!progress) {
          throw new NotFoundException('Progress not found for the specified user and course');
        }
    
        const grades = progress.performance;
        if (grades.length === 0) {
          throw new Error('No performance grades found for this user.');
        }
    
        // Calculate the GPA/average based on the grades
        let totalGradePoints = 0;
        for (let grade of grades) {
          if (this.gradeMapping[grade] === undefined) {
            throw new Error(`Invalid grade value: ${grade}`);
          }
          totalGradePoints += this.gradeMapping[grade];
        }
    
        const finalGrade = totalGradePoints / grades.length;
    
        // Return the final grade (GPA value)
        return parseFloat(finalGrade.toFixed(2)); // Limiting to 2 decimal places
      }
    

}
