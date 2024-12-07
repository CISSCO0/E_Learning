import { Injectable } from '@nestjs/common';
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
    const newAdmin = new this.adminModel(dto);
    return newAdmin.save();
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
  // Get an admin by Email
  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminModel.findOne({ email }).exec();
  }
// ====================================================================== 
}
