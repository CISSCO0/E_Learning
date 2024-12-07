import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { createStudentDTo } from './dto/createStudent.dto';
import { updateStudentDTo } from './dto/updateStudent.dto';
import { AuthGuard } from 'src/auth/guards/authentication.guard'; 
import { Request } from 'express';
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.decorator';
import { Student } from './models/student.Schema';

@UseGuards(AuthGuard , AuthorizationGuard) 
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
// ====================================================================== 
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin, Role.Student)
  @Post()
  async createStudent(@Body() dto: createStudentDTo, @Req() req: Request) {
      const userId = req.user['userid'];
      return this.studentService.createStudent(dto);
  }
// ====================================================================== 
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin)
  @Get()
  async getAllStudents(@Req() req: Request) {
      const userId = req.user['userid'];
      return this.studentService.getAllStudents(); 
  }
// ====================================================================== 
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin, Role.Instructor)
  @Get(':id')
  async getStudentById(@Param('id') id: string, @Req() req: Request) {
      const userId = req.user['userid'];
      return this.studentService.getStudentById(id); 
  }
// ====================================================================== 
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin, Role.Student)
  @Put(':id')
  async updateStudent(
      @Param('id') id: string,
      @Body() dto: updateStudentDTo,
      @Req() req: Request,
  ) {
      const userId = req.user['userid'];
      return this.studentService.updateStudent(id, dto);
  }
// ====================================================================== 
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin, Role.Student)
  @Delete(':id')
  async deleteStudent(@Param('id') id: string, @Req() req: Request) {
      const userId = req.user['userid'];
      return this.studentService.deleteStudent(id);
  }
// ====================================================================== 
@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.Instructor)
@Get('search')
async searchStudent(@Query() query: Partial<Student>): Promise<Student[]> {
  return this.studentService.searchStudent(query);
}
// ====================================================================== 

  @Roles(Role.Admin,Role.Instructor,Role.Student )
  @Get('/email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.studentService.findByEmail(email);
  }
// ======================================================================
}
