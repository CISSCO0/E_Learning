import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './models/student.Schema';
import { createStudentDTo } from './dto/createStudent.dto';
import { updateStudentDTo } from './dto/updateStudent.dto';
import { Users } from 'src/user/models/users.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}
// ======================================================================
  // Create a new student
  async createStudent(dto: createStudentDTo): Promise<Student> {
    const newStudent = new this.studentModel(dto);
    return newStudent.save();
  }
// ======================================================================
  // Get all students
  async getAllStudents(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }
// ======================================================================
  // Get a student by ID
  async getStudentById(id: string): Promise<Student> {
    return this.studentModel.findById(id).exec();
  }
// ======================================================================
  // Update a student
  async updateStudent(
    id: string,
    dto: updateStudentDTo,
  ): Promise<Student> {
    return this.studentModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }
// ======================================================================
  // Delete a student
  async deleteStudent(id: string): Promise<Student> {
    return this.studentModel.findByIdAndDelete(id).exec();
  }
// ======================================================================
  async findByUserId(userId: string): Promise<Student | null> {
    return this.studentModel.findOne({ user_id: userId }).exec();
  }
}
