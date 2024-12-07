import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ModuleProgress } from './models/moduleProgress.schema';
import { ResponsesService } from 'src/responses/response.service';
import { ModulesService } from 'src/modules/modules.services';
import { QuizzesService } from 'src/quizzes/quizzes.service';

@Injectable()
export class ModuleProgressService {
  constructor(
    @InjectModel('ModuleProgress')
    private readonly moduleProgressModel: Model<ModuleProgress>,
    private readonly responseService: ResponsesService,
    private readonly moduleService: ModulesService,
    private readonly quizzesService: QuizzesService,
  ) {}

  // Get progress by user ID
  async getProgressByUser(user_id: string): Promise<any[]> {
    const progressEntries = await this.moduleProgressModel.find({ user_id }).exec();

    return Promise.all(
      progressEntries.map(async (entry) => {
        const { module_id } = entry;
        const updatedProgress = await this.updateProgress(user_id, module_id);
        return { module_id, percentage: updatedProgress };
      }),
    );
  }

  // Get progress by module ID
   async getProgressByModule(module_id: string): Promise<any[]> {
    const progressEntries = await this.moduleProgressModel.find({ module_id }).exec();

    return Promise.all(
      progressEntries.map(async (entry) => {
        const { user_id } = entry;
        const updatedProgress = await this.updateProgress(user_id, module_id);
        return { user_id, percentage: updatedProgress };
      }),
    );
  }

  // Create a new progress entry
  async createProgress(user_id: string, module_id: string): Promise<ModuleProgress> {
    const newProgress = new this.moduleProgressModel({ user_id, module_id, percentage: 0, performance: [] });
    return await newProgress.save();
  }

  // Delete a progress entry
  async deleteProgress(user_id: string, module_id: string): Promise<void> {
    const result = await this.moduleProgressModel.findOneAndDelete({ user_id, module_id }).exec();
    if (!result) {
      throw new NotFoundException('Progress not found');
    }
  }

  // Calculate progress percentage using quiz responses
  async updateProgress(user_id: string, module_id: string): Promise<number> {
    //Fetch module by ID
    const module = await this.moduleService.getModuleById(module_id);
    if (!module) {
      throw new NotFoundException('Module not found');
    }
  
    // Find the progress entry for the user and the module
    const progress = await this.moduleProgressModel.findOne({ user_id, module_id }).exec();
    if (!progress) {
      throw new NotFoundException('Progress entry not found');
    }
    const quizzes = await this.quizzesService.getAllQuizzes();
    const quizzeIDs = quizzes.map(quiz => quiz._id.toString());
   // const quizzes = module.quizzes;
    if (!quizzes || quizzes.length === 0) {
      throw new NotFoundException('No quizzes found for this module.');
    }
  
    // Get all responses that match the user_id and belong to the quizzes of this module
    const responses = await this.responseService.getResponsesByUserAndQuizzes(user_id, quizzeIDs);
  
    // Calculate the progress percentage
    const completedQuizzes = responses.length;
    const totalQuizzes = quizzes.length;
    const newPercentage = (completedQuizzes / totalQuizzes) * 100;
   progress.percentage = Math.min(newPercentage, 100);
  
    If progress reaches 100%, calculate the average score for completed quizzes
    if (progress.percentage === 100 && completedQuizzes > 0) {
      // Calculate total score for completed quizzes
      const totalScore = responses.reduce((sum, response) => sum + response.score, 0);
      const averageScore = totalScore / completedQuizzes;
  
      // Initialize performance array if not already
      if (!Array.isArray(progress.performance)) {
        progress.performance = [];
      }
  
      // Add the average score to the performance array
      progress.performance.push(averageScore);
    }
  
    
  //  return await progress.save();
   return Math.min(newPercentage, 100);
  }
  
  
}
