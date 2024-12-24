import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { createInstructorDTo } from './dto/createInstructor.dto';
import { updateInstructorDTo } from './dto/updateInstructor.dto';
import { Instructor } from './models/instructorSchema';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.decorator';
import { Request,Response } from 'express';

@UseGuards(AuthGuard, AuthorizationGuard)
@Controller('instructors')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  // ======================================================================
  @Roles(Role.Admin)
  @Post()
  @UsePipes(new ValidationPipe())
  async createInstructor(@Body() dto: createInstructorDTo): Promise<Instructor> {
    return this.instructorService.createInstructor(dto);
  }

  // ======================================================================
  @Roles(Role.Admin, Role.Student)
  @Get()
  async getAllInstructors(): Promise<Instructor[]> {
    return this.instructorService.getAllInstructors();
  }
  @Get("report")
  async getInstructorRatingsReport(@Res() res: Response) {
    try {
      // Generate the report and get the file path
      const reportFilePath = await this.instructorService.generateInstructorReport();

      // Send the report as a downloadable file
      res.download(reportFilePath, 'instructor_ratings_report.csv', (err) => {
        if (err) {
          res.status(500).send('Error downloading the report');
        }

        // Clean up the file after download
        this.instructorService.deleteReportFile(reportFilePath);
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  // ======================================================================
  @Roles(Role.Admin, Role.Student)
  @Get(':id')
  async getInstructorById(@Param('id') id: string): Promise<Instructor> {
    return this.instructorService.getInstructorById(id);
  }

  // ======================================================================
  @Roles(Role.Admin)
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateInstructor(
    @Param('id') id: string,
    @Body() dto: updateInstructorDTo,
  ): Promise<Instructor> {
    return this.instructorService.updateInstructor(id, dto);
  }

  // ======================================================================
  @Roles(Role.Admin, Role.Instructor)
  @Delete(':id')
  async deleteInstructor(@Param('id') id: string): Promise<{ message: string }> {
    await this.instructorService.deleteInstructor(id);
    return { message: 'Instructor deleted successfully' };
  }

  // ======================================================================
  @Get('/user/:userId')
  async getInstructorByUserId(@Param('userId') userId: string) {
    const instructor = await this.instructorService.findByUserId(userId);
    
    if (!instructor) {
      throw new NotFoundException(`Instructor with user ID ${userId} not found`);
    }
    return instructor;
  }
}

