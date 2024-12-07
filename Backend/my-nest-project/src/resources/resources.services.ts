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

  // Add a new resource with Multer
  async addResource(moduleId: string, createResourceDto: CreateResourceDto, fileName: string, filePath: string): Promise<resource> {
    const module = await this.moduleModel.findById(moduleId);
    if (!module) throw new NotFoundException('Module not found');

    // Create the resource in the database with file info
    const newResource = new this.resourceModel({
      ...createResourceDto,
      fileName,
      filePath,
      outdated: false,
    });

    const savedResource = await newResource.save();

    // Associate the resource with the module
    module.resources.push(savedResource);
    await module.save();

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
      })
      .exec();

    if (!module) throw new NotFoundException('Module not found');

    return module.resources;
  }

  async fetchAllResourcesWithDownloadLinks(moduleId: string): Promise<resource[]> {
    const module = await this.moduleModel.findById(moduleId).populate('resources').exec();
    if (!module) throw new NotFoundException('Module not found');

    return module.resources.map((res) => ({
      ...res.toObject(),
      downloadLink: `/resources/download/${res.fileName}`,
    }));
  }

  async downloadResource(fileName: string, res: any): Promise<void> {
    const filePath = path.join(__dirname, './uploads', fileName);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

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
