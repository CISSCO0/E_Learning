import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './models/admin.shema';
import { createAdminDTo } from './dto/createAdmin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
  ) {}
// ====================================================================== 
  // Create a new admin
  async createAdmin(dto: createAdminDTo): Promise<Admin> {
    try {
      // Attempt to create and save the new admin
      const newAdmin = new this.adminModel(dto);
      const savedAdmin = await newAdmin.save();
      return savedAdmin; // Return the saved admin
    } catch (error) {
      // Handle any errors that occur during saving
      console.error('Error while creating admin:', error);
  
      // If the error is related to duplicate admin (e.g., duplicate email or other unique constraint)
      if (error.code === 11000) { // MongoDB duplicate key error code
        throw new ConflictException('Admin with this email already exists');
      }
  
      // Handle other server errors
      throw new InternalServerErrorException('Failed to create admin');
    }
  }
// ====================================================================== 
  // Get all admins
  async getAllAdmins(): Promise<Admin[]> {
    return this.adminModel.find().exec();
  }
// ====================================================================== 
  // Get an admin by ID
  async getAdminById(id: string): Promise<Admin> {
    return this.adminModel.findById(id).exec();
  }
// ====================================================================== 
  // Update an admin by ID
  async updateAdmin(id: string, dto: createAdminDTo): Promise<Admin> {
    return this.adminModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }
// ====================================================================== 
  // Delete an admin by ID
  async deleteAdmin(id: string): Promise<Admin> {
    return this.adminModel.findByIdAndDelete(id).exec();
  }
// ====================================================================== 
}

