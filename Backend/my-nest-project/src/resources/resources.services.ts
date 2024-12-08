import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { resource } from './models/resourse.schema';
import { Modules } from '../modules/models/modules.schema';
import { CreateResourceDto } from './dto/create.resource.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectModel(resource.name) private resourceModel: Model<resource>,
    @InjectModel(Modules.name) private moduleModel: Model<Modules>,
  ) {}

  async addResource(
    moduleId: string,
    createResourceDto: CreateResourceDto,
    fileName: string,
    filePath: string,
  ): Promise<resource> {
    console.log('Looking for module with ID:', moduleId); // Debug log
    const module = await this.moduleModel.findById(moduleId);
  
    if (!module) {
      console.error('Module not found with ID:', moduleId); // Debug log
      throw new NotFoundException('Module not found');
    }
  
    console.log('Found module:', module); // Debug log
  
    // Create the resource in the database with file info
    const newResource = new this.resourceModel({
      ...createResourceDto,
      fileName,
      filePath,
      outdated: false,
    });
  
    console.log('Creating new resource with details:', newResource); // Debug log
    const savedResource = await newResource.save();
    console.log('Saved new resource:', savedResource); // Debug log
  
    // Associate the resource with the module
    module.resources.push(savedResource);
    console.log('Updated module resources:', module.resources); // Debug log
    await module.save();
    console.log('Module successfully updated with new resource'); // Debug log
  
    return savedResource;
  }
  

  async updateResourceOutdatedFlag(resourceId: string): Promise<resource> {
    const resourceItem = await this.resourceModel.findById(resourceId);
    if (!resourceItem) throw new NotFoundException('Resource not found');

    resourceItem.outdated = true;
    return resourceItem.save();
  }

  async fetchNonOutdatedResources(moduleId: string): Promise<resource[]> {
    const module = await this.moduleModel
      .findById(moduleId)
      .populate({
        path: 'resources',
        match: { outdated: false },
        options: { sort: { createdAt: -1 } }, // Sort resources by date in descending order
      })
      .exec();

    if (!module) throw new NotFoundException('Module not found');

    return module.resources;
  }

  async fetchAllResourcesWithDownloadLinks(moduleId: string): Promise<any[]> {
    const module = await this.moduleModel
      .findById(moduleId)
      .populate('resources')
      .lean() // Ensure that the resources are plain objects
      .exec();
  
    if (!module) throw new NotFoundException('Module not found');
  
    return module.resources.map((res) => ({
      ...res,
      downloadLink: `/resources/download/${res.fileName}`,
    }));
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

  async downloadResource(fileName: string, res: any): Promise<void> {
    // Resolve the path relative to the root directory of your project
    const filePath = path.resolve(__dirname, '../..', 'uploads', fileName);
    console.log(filePath + "yeas");
  
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }
  
    // Send the file to the client
    res.sendFile(filePath);
  }

  async deleteResource(moduleId: string, resourceId: string): Promise<Modules> {
    const module = await this.moduleModel.findById(moduleId);
    if (!module) throw new NotFoundException('Module not found');

    module.resources = module.resources.filter((resId) => resId.toString() !== resourceId);
    await module.save();

    const resourceToDelete = await this.resourceModel.findById(resourceId);
    if (!resourceToDelete) throw new NotFoundException('Resource not found');

    // Delete the file from the server
    const filePath = path.join(__dirname, './uploads', resourceToDelete.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove the resource from the database
    await this.resourceModel.findByIdAndDelete(resourceId);

    return module;
  }
}
