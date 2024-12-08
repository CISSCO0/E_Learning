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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { createStudentDTo } from './dto/createStudent.dto';
import { updateStudentDTo } from './dto/updateStudent.dto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.decorator';
import { Student } from './models/student.Schema';

//@UseGuards(AuthGuard, AuthorizationGuard)
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // ======================================================================
 // @Roles(Role.Admin, Role.Student)
  @Post()
 // @UsePipes(new ValidationPipe())
  async createStudent(@Body() dto: createStudentDTo): Promise<Student> {
    return this.studentService.createStudent(dto);
  }

  // ======================================================================
  @Roles(Role.Admin)
  @Get()
  async getAllStudents(): Promise<Student[]> {
    return this.studentService.getAllStudents();
  }

  // ======================================================================
  @Roles(Role.Admin, Role.Instructor)
  @Get(':id')
  async getStudentById(@Param('id') id: string): Promise<Student> {
    return this.studentService.getStudentById(id);
  }

  // ======================================================================
  //@Roles(Role.Admin, Role.Student)
  @Put(':id')
 // @UsePipes(new ValidationPipe())
  async updateStudent(
    @Param('id') id: string,
    @Body() dto: updateStudentDTo,
  ): Promise<Student> {
    return this.studentService.updateStudent(id, dto);
  }

  // ======================================================================
  @Roles(Role.Admin, Role.Student)
  @Delete(':id')
  async deleteStudent(@Param('id') id: string): Promise<{ message: string }> {
    await this.studentService.deleteStudent(id);
    return { message: 'Student deleted successfully' };
  }

  // ======================================================================
  @Roles(Role.Admin, Role.Instructor)
  @Get('search')
  async searchStudent(
    @Query() query: Partial<Student>,
  ): Promise<Student[]> {
    return this.studentService.searchStudent(query);
  }

  // ======================================================================
  @Roles(Role.Admin, Role.Instructor, Role.Student)
  @Get('/email/:email')
  async findByEmail(@Param('email') email: string): Promise<Student | null> {
    return this.studentService.findByEmail(email);
  }
}
