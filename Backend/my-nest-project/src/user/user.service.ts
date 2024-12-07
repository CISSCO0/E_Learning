import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from './models/users.schema';
import { createUserDTo } from './dto/createUser.dto';
import { updateUserDTo } from './dto/updateUser.dto';
import { Admin } from 'src/admin/models/admin.shema';
import { Student } from 'src/student/models/student.Schema'
import { Instructor } from 'src/instructor/models/instructorSchema';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
    // @InjectModel('Student') private readonly studentModel: Model<Student>,
    // @InjectModel('Instructor') private readonly instructorModel: Model<Instructor>,
    // @InjectModel('Admin') private readonly adminModel: Model<Admin>,
  ) {}
// ======================================================================
  // Create a new user
  async createUser(dto: createUserDTo): Promise<Users> {
    try {
      // Attempt to create and save the new user
      const newUser = new this.userModel(dto);
      const savedUser = await newUser.save();
      return savedUser; // Return the saved user
  
    } catch (error) {
      // Log the error and throw a custom exception or rethrow it
      console.error('Error while creating user:', error);
      throw new Error('Failed to create user'); // You can throw a custom error or handle it in other ways
    }
  }
  
  
// ======================================================================
  // Get all users
  async getAllUsers(): Promise<Users[]> {
    return this.userModel.find().exec();
  }
// ======================================================================
  // Get user by ID
  async getUserById(userId: string): Promise<Users> {
    return this.userModel.findById(userId).exec();
  }
// ======================================================================
  // Update user by ID
  async updateUser(userId: string, dto: updateUserDTo): Promise<Users> {
    return this.userModel.findByIdAndUpdate(userId, dto, { new: true }).exec();
  }
// ======================================================================
  // Delete user by ID
  async deleteUser(userId: string): Promise<Users> {
    return this.userModel.findByIdAndDelete(userId).exec();
  }
// ======================================================================
  // Get an student by Email
  async findByEmail(email: string): Promise<Users | null> {
    return this.userModel.findOne({ email }).exec();
  }
// ====================================================================== 
}
