import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Instructor, InstructorDocument } from './models/instructorSchema';
import { createInstructorDTo } from './dto/createInstructor.dto';
import { updateInstructorDTo } from './dto/updateInstructor.dto';

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

}

