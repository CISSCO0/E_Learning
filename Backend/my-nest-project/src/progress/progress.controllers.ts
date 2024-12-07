import { Controller, Get, Post, Body, Param , NotFoundException,Delete ,Patch} from '@nestjs/common';
import { ProgressService } from './progress.sevices';
import { UpdateProgressDto } from './dto/update.dto';
import {CreateProgressDto } from './dto/create.dto'
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post(':userId/:moduleId/complete')
  async completeModule(
    @Param('userId') userId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.progressService.completeModule(userId, moduleId);
  }

  @Get(':userId/:courseId')
  async getProgress(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.progressService.getProgress(userId, courseId);
  }
  @Post()
  async createProgress(@Body() createProgressDto: CreateProgressDto) {
    return await this.progressService.create(createProgressDto);

  }
   // GET All Progress
   @Get()
   async getAllProgress() {
     return await this.progressService.findAll();
   }
 
   // GET by ID
   @Get(':id')
   async getProgressById(@Param('id') id: string) {
     const progress = await this.progressService.findById(id);
     if (!progress) {
       throw new NotFoundException(`Progress with ID ${id} not found`);
     }
     return progress;
   }
 
   // UPDATE by ID
   @Patch(':id')
   async updateProgress(
     @Param('id') id: string,
     @Body() updateProgressDto: UpdateProgressDto,
   ) {
     const updatedProgress = await this.progressService.updateById(
       id,
       updateProgressDto,
     );
     if (!updatedProgress) {
       throw new NotFoundException(`Progress with ID ${id} not found`);
     }
     return updatedProgress;
   }
 
   // DELETE by ID
   @Delete(':id')
   async deleteProgress(@Param('id') id: string) {
     const deletedProgress = await this.progressService.deleteById(id);
     if (!deletedProgress) {
       throw new NotFoundException(`Progress with ID ${id} not found`);
     }
     return { message: `Progress with ID ${id} has been deleted` };
   }
  
}

