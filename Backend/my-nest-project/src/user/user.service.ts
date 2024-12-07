import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from './models/users.schema';
import { createUserDTo } from './dto/createUser.dto';
import { updateUserDTo } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}
// ======================================================================
  // Create a new user
  async createUser(dto: createUserDTo): Promise<Users> {
    const newUser = new this.userModel(dto);
    return newUser.save();
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
