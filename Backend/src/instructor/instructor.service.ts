import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Instructor, InstructorDocument } from './models/instructorSchema';
import { createInstructorDTo } from './dto/createInstructor.dto';
import { updateInstructorDTo } from './dto/updateInstructor.dto';
import * as fs from 'fs';
import * as path from 'path';
import { ObjectId } from 'mongoose';

@Injectable()
export class InstructorService
{
  constructor
  (
    @InjectModel(Instructor.name)
    private readonly instructorModel: Model<InstructorDocument>,
  ) {}
// ======================================================================
  // Create a new instructor
  async createInstructor(dto: createInstructorDTo): Promise<Instructor> 
  {
    try 
    {
      const newInstructor = new this.instructorModel(dto);
      return await newInstructor.save(); 
    } 
    catch (error) 
    {
      console.error('Error creating instructor:', error);
      throw new Error('Failed to create instructor');
    }
  }
  
// ======================================================================
  // Get all instructors
  async getAllInstructors(): Promise<Instructor[]>
  {
    return this.instructorModel.find().exec();
  }
// ======================================================================
  // Get an instructor by ID
  async getInstructorById(id: string): Promise<Instructor> 
  {
    return this.instructorModel.findById(id).exec();
  }
// ======================================================================
  // Update an instructor
  async updateInstructor
  (
    id: string,
    dto: updateInstructorDTo,
  ): Promise<Instructor> 
  {
    return this.instructorModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }
// ======================================================================
  // Delete an instructor
  async deleteInstructor(id: string): Promise<Instructor> 
  {
    return this.instructorModel.findByIdAndDelete(id).exec();
  }
// ======================================================================
async findByUserId(userId: string): Promise<Instructor | null> {
  return this.instructorModel.findOne({ user_id: userId }).exec();
}

async generateInstructorReport(): Promise<string> {
  try {
    // Fetch all instructors
    const allInstructors = await this.instructorModel.find().exec();
    if (!allInstructors || allInstructors.length === 0) {
      throw new Error('No instructors found');
    }

    // Prepare headers for the report
    const headers = ['Instructor User ID', 'Instructor Rating'];

    // Initialize rows
    const rows: string[] = [];

    for (const instructor of allInstructors) {
      const instructorId = instructor.user_id || 'Unknown';
      const instructorRating = instructor.rating || 'N/A';
      
      // Add row for each instructor
      rows.push(`${instructorId},${instructorRating}`);
    }

    // Combine headers and rows
    const reportData = [headers.join(','), ...rows].join('\n');

    // Save the report to a file
    const reportFilePath = path.join(__dirname, `instructor_ratings_report.csv`);
    fs.writeFileSync(reportFilePath, reportData);

    return reportFilePath; // Return the file path for download
  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error('Error generating instructor ratings report');
  }
}

async deleteReportFile(filePath: string): Promise<void> {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting report file:', error);
    throw new Error('Error deleting the report file');
  }
}
}

