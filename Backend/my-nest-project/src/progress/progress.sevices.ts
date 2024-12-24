import { BadRequestException, Injectable, NotFoundException,Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress } from './models/progress.schema';
import { Student} from '../student/models/student.Schema';
import { Modules} from '../modules/models/modules.schema';
import { UpdateProgressDto } from './dto/update.dto';
import {CreateProgressDto} from './dto/create.dto'
import { StudentModule } from 'src/student/student.module';
import * as fs from 'fs';
import * as path from 'path';
import { response } from 'express';
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
    
  // Calculate the final grade (GPA and corresponding letter grade)
  async calculateFinalGrade(userId: string, courseId: string): Promise<string> {
    const progress = await this.progressModel.findOne({ user_id: userId, course_id: courseId });
    if (!progress) {
      throw new NotFoundException('Progress not found for the specified user and course');
    }

    const grades = progress.performance;

    // if (grades.length === 0) {
    //   throw new Error('No performance grades found for this user.');
    // }

    let totalGradePoints = 0;
    for (let grade of grades) {
      const numericGrade = Number(grade); // Converts to number
      if (isNaN(numericGrade)) {
        throw new Error(`Invalid grade value: ${grade}`);
      }
      totalGradePoints += numericGrade;
    }

    const finalGPA = totalGradePoints / grades.length;

    let letterGrade = '';
    if (finalGPA >= 90) {
      letterGrade = 'A';
    } else if (finalGPA >= 80) {
      letterGrade = 'B';
    } else if (finalGPA >= 60) {
      letterGrade = 'C';
    } else if (finalGPA >= 40) {
      letterGrade = 'D';
    } else {
      letterGrade = 'F';
    }

    return letterGrade;
  }// Generate the report for quiz results, including performance categories
  async generateAllProgressReport(): Promise<string> {
    // Fetch all progress rows from the database
    const allProgress = await this.progressModel.find().exec();
  
    if (!allProgress || allProgress.length === 0) {
      throw new NotFoundException('No progress data found');
    }
  
    // Prepare headers for the report
    const headers = ['User ID', 'Course ID', 'Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Final Grade', 'Level'];
  
    // Prepare rows
    const rows = allProgress.map(progress => {
      const performance = progress.performance; // Array of quiz grades
      const finalGrade = this.calculateUserFinalGrade(performance); // Calculate final grade
      const level = this.getPerformanceCategory(finalGrade); // Determine the level based on the grade
  
      // Add user details, course ID, and grades
      return [
        progress.user_id, // User ID
        progress.course_id, // Course ID
        ...performance, // Quiz grades (e.g., Quiz 1, Quiz 2, ...)
        finalGrade, // Final grade (A, B, etc.)
        level, // Level (Excellent, Average, etc.)
      ].join(', ');
    });
  
    // Combine headers and rows
    const reportData = [headers.join(', '), ...rows].join('\n');
  
    // Save the report to a file
    const reportFilePath = path.join(__dirname, `progress_report.csv`);
    fs.writeFileSync(reportFilePath, reportData);
  
    return reportFilePath; // Return the file path for download
  }
  
  // Helper function to calculate final grade from performance
  private calculateUserFinalGrade(performance: string[]): string {
    if (performance.length === 0) return 'F'; // Default to F if no grades exist
  
    const totalGradePoints = performance.reduce((sum, grade) => sum + Number(grade), 0);
    const finalGPA = totalGradePoints / performance.length;
  
    // Map GPA to letter grade
    if (finalGPA >= 90) return 'A';
    if (finalGPA >= 80) return 'B';
    if (finalGPA >= 60) return 'C';
    if (finalGPA >= 40) return 'D';
    return 'F';
  }
  
  // Helper function to map grade to performance level
  private getPerformanceCategory(finalGrade: string): string {
    switch (finalGrade) {
      case 'A':
        return 'Excellent';
      case 'B':
        return 'Above Average';
      case 'C':
        return 'Average';
      case 'D':
        return 'Below Average';
      default:
        return 'Poor';
    }
  }
  
  // Delete the report file after download
  async deleteReportFile(filePath: string) {
    fs.unlinkSync(filePath);
  }
  async generateCourseCompletionReport(): Promise<string> {
    try {
      // Fetch the required data from the progress collection
      const progressData = await this.progressModel.find({}, { course_id: 1, user_id: 1, completion_percentage: 1 });

      if (!progressData || progressData.length === 0) {
        throw new NotFoundException('No progress data found');
      }

      // Initialize containers for course completion data
      const courseCompletionData: { [courseId: string]: { students: number; completed: number; details: string[] } } = {};

      // Loop through the progress data and organize it by course
      progressData.forEach((progress) => {
        const courseId = progress.course_id.toString();
        const userId = progress.user_id;
        const completionRate = progress.completion_percentage;

        // Initialize course data if not already present
        if (!courseCompletionData[courseId]) {
          courseCompletionData[courseId] = { students: 0, completed: 0, details: [] };
        }

        // Increment student count and completion count based on completion rate
        courseCompletionData[courseId].students++;
        if (completionRate === 100) {
          courseCompletionData[courseId].completed++;
        }

        // Add the user details to the report (student ID, completion rate)
        courseCompletionData[courseId].details.push(`${courseId}, ${userId}, ${completionRate}`);
      });

      // Prepare CSV content
      const courseCompletionRows: string[] = [];
      const courseSummaryRows: string[] = [];

      // Prepare the details rows for each course
      for (const [courseId, data] of Object.entries(courseCompletionData)) {
        // Add course-specific details (student ID and completion rate)
        courseCompletionRows.push(...data.details);

        // Add a summary row with the course total information (students and completed)
        courseSummaryRows.push(`${courseId}, ${data.students}, ${data.completed}`);
      }

      // Combine the headers and rows for the CSV file
      const courseCompletionHeader = 'Course ID, Student ID, Completion Rate';
      const courseSummaryHeader = 'Course ID, Total Students, Total Completed';

      const csvString = [
        courseCompletionHeader,
        ...courseCompletionRows,
        '',
        courseSummaryHeader,
        ...courseSummaryRows
      ].join('\n');

      // Ensure the reports directory exists
      const reportDirectory = path.join(__dirname, '../reports');
      if (!fs.existsSync(reportDirectory)) {
        fs.mkdirSync(reportDirectory, { recursive: true });
      }

      // Define the file path where the report will be saved
      const reportFilePath = path.join(reportDirectory, 'course_completion_report.csv');

      // Write the CSV data to the file system
      fs.writeFileSync(reportFilePath, csvString);

      // Return the file path for download
      return reportFilePath;

    } catch (error) {
      console.error('Error generating course completion report:', error);
      throw new Error(`Failed to generate the report: ${error.message || error}`);
    }
  }}