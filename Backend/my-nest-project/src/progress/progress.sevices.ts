import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress } from './models/progress.schema';
import { Student} from '../student/models/student.Schema';
import { Modules} from '../modules/models/modules.schema';
import { UpdateProgressDto } from './dto/update.dto';
import {CreateProgressDto} from './dto/create.dto'

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<Progress>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Modules.name) private modulesModel: Model<Modules>,
  ) {}

  async completeModule(userId: string, moduleId: string): Promise<Progress> {
    //asheel course mn enrolled courses  kman  

    // Find the progress record
    const progress = await this.progressModel.findOne({ user_id: userId });
    if (!progress) throw new Error('Progress record not found');

    // Avoid duplicate entries
    if (progress.modulesId.includes(moduleId)) return progress;

    // Add module to the array
    progress.modulesId.push(moduleId);

    // Update completion percentage
    const totalModules = await this.modulesModel.countDocuments({
      course_id: progress.course_id,
    });
    progress.completion_percentage = Math.min(
      (progress.modulesId.length / totalModules) * 100,
      100,
    );

    // Check if progress is complete
    if (progress.completion_percentage === 100) {
      const student = await this.studentModel.findOne({ _id: userId });
      if (!student) throw new Error('Student record not found');
      /// dont forget to add grade calculate by prformance array 
      student.certificates.push(`certificate-${progress.course_id}`); // Add certificate
      await student.save();
    }

    progress.last_accessed = new Date();
    return await progress.save();
  }
    // CREATE Progress
    async create(createProgressDto: CreateProgressDto): Promise<Progress> {
        const newProgress = new this.progressModel(createProgressDto);
        return await newProgress.save();
      }

  async getProgress(userId: string, courseId: string) {
    return this.progressModel.findOne({ user_id: userId, course_id: courseId });
  }
  async findAll():Promise<Progress[]>{
    return this.progressModel.find().exec();
  }

 async findById(id: string): Promise<Progress|null> {
    return this.progressModel.findById(id).exec();
  }
   // Update by ID
   async updateById(
    id: string,
    updateProgressDto: UpdateProgressDto,
  ): Promise<Progress | null> {
    return this.progressModel.findByIdAndUpdate(
      id,
      { $set: updateProgressDto },
      { new: true },
    ).exec();
  }
    // Delete by ID
    async deleteById(id: string): Promise<Progress| null> {
        return this.progressModel.findByIdAndDelete(id).exec();
        
      }

}
