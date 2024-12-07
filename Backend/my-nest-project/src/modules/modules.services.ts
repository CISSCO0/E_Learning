import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Modules } from './models/modules.schema';
import { resource } from '../resources/models/resourse.schema';
import { CreateModuleDto } from './dto/create.modules.dto';
import { CreateResourceDto } from '../resources/dto/create.resource.dto';
import { UpdateModuleDto } from './dto/update.modules.dto';
import { DeleteModuleDto } from './dto/delete.modules.dto';

//students can reg course + enter all modules in the cource and do performance in all modules 
//get module by id 

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Modules.name) private moduleModel: Model<Modules>,
    @InjectModel(resource.name) private resourceModel: Model<resource>,
  ) {}

  async addModule(createModuleDto: CreateModuleDto ): Promise<Modules> {
    const newModule = new this.moduleModel(createModuleDto);
    return newModule.save();
  }

  async updateModule(updateModuleDto: UpdateModuleDto): Promise<Modules> {
    const { moduleId, ...updateData } = updateModuleDto;
  
    const module = await this.moduleModel.findById(moduleId);
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
  async fetchNonOutdatedResources(moduleId: string): Promise<resource[]> {
    const module = await this.moduleModel
      .findById(moduleId)
      .populate({
        path: 'resources',
        match: { outdated: false },
        options: { sort: { createdAt: -1 } }, 
      })
      .exec();
  
    if (!module) throw new NotFoundException('Module not found');
  
    return module.resources;
  }
  async fetchAllResourcesByModuleId(moduleId: string): Promise<resource[]> {
    const module = await this.moduleModel
      .findById(moduleId)
      .populate({
        path: 'resources',
        options: { sort: { createdAt: -1 } }, // Sort resources by date in descending order
      })
      .exec();
  
    if (!module) throw new NotFoundException('Module not found');
  
    return module.resources;
  }
  
  async fetchNonOutdatedResourcesByModuleId(moduleId: string): Promise<resource[]> {
    const module = await this.moduleModel
      .findById(moduleId)
      .populate({
        path: 'resources',
        match: { outdated: false }, // Filters resources with outdated = false
        options: { sort: { createdAt: -1 } }
      })
      .exec();
  
    if (!module) throw new NotFoundException('Module not found');
  
    return module.resources;
  }
  

  
}
