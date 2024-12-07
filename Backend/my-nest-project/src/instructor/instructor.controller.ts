import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { createInstructorDTo } from './dto/createInstructor.dto';
import { updateInstructorDTo } from './dto/updateInstructor.dto';
import { Instructor } from './models/instructorSchema';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Request } from 'express';
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.decorator';


@UseGuards(AuthGuard,AuthorizationGuard)
@Controller('instructors')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}
// ======================================================================
  @Roles(Role.Admin)
  @Post()
  async createInstructor(@Body() dto: createInstructorDTo, @Req() req: Request) {
      const userId: any = req.user['userid'];
      return this.instructorService.createInstructor(dto);
  }
// ======================================================================
  @Roles(Role.Admin, Role.Student)
  @Get()
  async getAllInstructors(@Req() req: Request) {
      const userId: any = req.user['userid'];
      return this.instructorService.getAllInstructors();
  }
// ======================================================================

  @Roles(Role.Admin, Role.Student)
  @Get(':id')
  async getInstructorById(@Param('id') id: string, @Req() req: Request) {
      const userId: any = req.user['userid'];
      return this.instructorService.getInstructorById(id);
  }
// ======================================================================

  @Roles(Role.Admin)
  @Put(':id')
  async updateInstructor(
      @Param('id') id: string,
      @Body() dto: updateInstructorDTo,
      @Req() req: Request,
  ) {
      const userId: any = req.user['userid'];
      return this.instructorService.updateInstructor(id, dto);
  }
// ======================================================================
 
  @Roles(Role.Admin, Role.Instructor)
  @Delete(':id')
  async deleteInstructor(@Param('id') id: string, @Req() req: Request) {
      const userId: any = req.user['userid'];
      return this.instructorService.deleteInstructor(id);
  }
  // ======================================================================

  @Roles(Role.Admin, Role.Student)
  @Get('search')
  async searchInstructor(@Query() query: Partial<Instructor>): Promise<Instructor[]> {
    return this.instructorService.searchInstructor(query);
  }
 // ======================================================================
 
  @Roles(Role.Admin ,Role.Instructor,Role.Student)
  @Get('/email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.instructorService.findByEmail(email);
  }
// ======================================================================
}
