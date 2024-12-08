import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Modules } from './models/modules.schema';
import { resource } from '../resources/models/resourse.schema';
import { CreateModuleDto } from './dto/create.modules.dto';
import { UpdateModuleDto } from './dto/update.modules.dto';
import { DeleteModuleDto } from './dto/delete.modules.dto';


@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Modules.name) private moduleModel: Model<Modules>,
    @InjectModel(resource.name) private resourceModel: Model<resource>,
  ) {}
  async findAll(): Promise<Modules[]> {
    return this.moduleModel.find().exec(); 
  }
  async getModuleById(moduleId: string): Promise<Modules> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }
    return module;
  }
  async addModule(createModuleDto: CreateModuleDto ): Promise<Modules> {
    const newModule = new this.moduleModel(createModuleDto);
    return newModule.save();
  }

  async updateModule(updateModuleDto: UpdateModuleDto): Promise<Modules> {
    const { module_id, ...updateData } = updateModuleDto;
  
    const module = await this.moduleModel.findById(module_id);
    if (!module) throw new NotFoundException('Module not found');
  
    // Update module fields with provided data
    Object.assign(module, updateData);
  
    return module.save();
  }
  
  async deleteModule( deleteModuleDto: DeleteModuleDto): Promise<void> {
    const module = await this.moduleModel.findOneAndDelete({ _id:deleteModuleDto.moduleId });
    if (!module) throw new NotFoundException('Module not found');

    // Delete all resources in the module
    await this.resourceModel.deleteMany({ _id: { $in: module.resources } });
    // delet all progresses 
  }
  ////////fetching 

  async fetchModules(moduleId: string): Promise<Modules[]> {
    return this.moduleModel.find({ course_id: moduleId }).populate({
      path: 'resources',
      options: { sort: { createdAt: -1 } }, // Sort resources by date in descending order
    });
  }


}
