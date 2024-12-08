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
} from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { createInstructorDTo } from './dto/createInstructor.dto';
import { updateInstructorDTo } from './dto/updateInstructor.dto';
import { Instructor } from './models/instructorSchema';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.decorator';
import { Request } from 'express';

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
  
}

