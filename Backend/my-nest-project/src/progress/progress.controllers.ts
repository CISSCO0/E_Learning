import { Controller, Get, Post, Body, Param , NotFoundException,Delete ,Patch,UseGuards, BadRequestException, Res} from '@nestjs/common';
import { ProgressService } from './progress.sevices';
import { UpdateProgressDto } from './dto/update.dto';
import {CreateProgressDto } from './dto/create.dto';
import { Role, Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
import { AuthGuard } from '../auth/guards/authentication.guard';
import { Response } from 'express';
@Controller('progress')
@UseGuards(AuthorizationGuard)
 @UseGuards(AuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}
    // Register progress for a course\
    @Post('/enroll')
    @Roles(Role.Student)
    async registerCourse(@Body() createProgressDto: CreateProgressDto) {
      return this.progressService.registerCourse(createProgressDto);
    }
  @Post()
@Roles(Role.Instructor)
 @Roles(Role.Admin)
  async createProgress(@Body() createProgressDto: CreateProgressDto) {
    return await this.progressService.create(createProgressDto);
  }
  @Get(':userId/:courseId/final-grade')
  @Public()
  async getFinalGrade(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {

    const finalGrade = await this.progressService.calculateFinalGrade(userId, courseId);
    return { finalGrade };
   }
   // GET All Progress
   @Get()
   async getAllProgress() {
     return await this.progressService.findAll();
   }
   
   @Get('quiz-results/')
   async getAllProgressReport(@Res() res: Response) {
    try {
      // Call the service to generate the report
      const reportFilePath = await this.progressService.generateAllProgressReport();
  console.log(reportFilePath)
      // Send the report as a downloadable file
      res.download(reportFilePath, `progress_report.csv`, (err) => {
        if (err) {
          res.status(500).send('Error downloading the report');
        }
  
        // Clean up the file after download
        this.progressService.deleteReportFile(reportFilePath);
      });
    } catch (error) {
      // Handle errors (e.g., no data found)
      res.status(404).json({ message: error.message });
    }
  }
 
   // GET by ID
   @Get(':id')
   @Public()
   async getProgressById(@Param('id') id: string) {
     const progress = await this.progressService.findById(id);
     if (!progress) {
       throw new NotFoundException(`Progress with ID ${id} not found`);
     }
     return progress;
   }
 
   // UPDATE by ID
   @Patch(':id')
 @Roles(Role.Instructor)
 @Roles(Role.Admin)
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
 @Roles(Role.Instructor)
  @Roles(Role.Admin)
    @Roles(Role.Admin)
   async deleteProgress(@Param('id') id: string) {
     const deletedProgress = await this.progressService.deleteById(id);
     if (!deletedProgress) {
       throw new NotFoundException(`Progress with ID ${id} not found`);
     }
     return { message: `Progress with ID ${id} has been deleted` };
   }
 
   @Get(':userId/:courseId')
  @Public()
   async getProgress(
     @Param('userId') userId: string,
     @Param('courseId') courseId: string,
   ) {
     return this.progressService.getProgress(userId, courseId);
   }

   @Post(':userId/:moduleId/complete')
   @Roles(Role.Instructor)
 @Roles(Role.Admin)
   async completeModule(
     @Param('userId') userId: string,
     @Param('moduleId') moduleId: string,
   ) {
     return this.progressService.completeModule(userId, moduleId);
   }
  
}

