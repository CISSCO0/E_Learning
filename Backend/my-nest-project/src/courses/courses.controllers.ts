
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards , Query  } from '@nestjs/common';
import { CoursesService } from './courses.services';
import { Courses } from './models/courses.schema';
import { CreateCourseDto } from './dto/create.course.dto';
import { UpdateCourseDto } from './dto/update.course.dto';
import { HttpCode, HttpStatus } from '@nestjs/common'; // to manage HTTP status codes
// import { Role, Roles } from '../auth/decorators/roles.decorator';
// import { Public} from '../auth/decorators/public.decorator';
// import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
// import { AuthGuard} from '../auth/guards/authentication.guard';
//import { Instructor } from 'src/models/instructorSchema';

@Controller('courses')
// @UseGuards(AuthorizationGuard)
// @UseGuards(AuthGuard)
export class CoursesController {
  constructor(private courseService: CoursesService) {}

  // Create a Course
  @Post() //done testing 
  //logs not done 
  // @Roles(Role.Instructor)
  // @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED) // 201: Resource successfully created
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Courses> {
    return this.courseService.create(createCourseDto);
  }

  // Update a Course //done 
  //logs not done 
  @Put(':courseId')
  // @Roles(Role.Instructor)
  // @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK) // 200: Successfully updated the resource
  async update(
    @Param('courseId') courseId: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Courses> {
    return this.courseService.update(courseId, updateCourseDto);
  }

  // Update a Course Rating //done 
  @Put(':courseId/rating')
  // @Roles(Role.Instructor)
  // @Roles(Role.Admin)
  async updateRating(@Param('courseId') courseId: string, @Body('rating') rating: number): Promise<Courses> {
    return this.courseService.updateRating(courseId, rating);
  }

  // Delete a Course
  @Delete(':courseId')//cant be tested needed student module 
  //logs not done 
  // @Roles(Role.Instructor)
  // @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT) // 204: Successfully deleted, no content returned
  async delete(@Param('courseId') courseId: string): Promise<void> {
    await this.courseService.delete(courseId);
  }

  // Fetch All Courses (for admins/instructors)
  //done
  @Get('public')
  // @Roles(Role.Instructor)
  // @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK) // 200: Successfully fetched resources
  async findAll(): Promise<Courses[]> {
    return this.courseService.findAll();
  }

  // Fetch a Specific Course by ID (for admins/instructors)
  @Get('public/:courseId')
  //done
  // @Roles(Role.Instructor)
  // @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK) // 200: Successfully fetched the resource
  async findOne(@Param('courseId') courseId: string): Promise<Courses> {
    return this.courseService.findOne(courseId);
  }

  // Search Courses by Keywords for All Roles
  @Get('searchpublic')
  // @Public()
  //done 
  @HttpCode(HttpStatus.OK) // 200: Successfully fetched the resources
  async searchCoursesforAllRoles(
    @Query('keywords') keywords: string[], // Accept keywords as a query parameter
  ): Promise<Courses[]> {
    return this.courseService.searchByKeywordsForStudents(keywords);
  }

  // Search Courses by Keywords for Instructors/Admins
  @Get('search')
  // @Roles(Role.Instructor)
  // @Roles(Role.Admin)
  //done
  @HttpCode(HttpStatus.OK)
  async searchCourses(@Query('keywords') keywords: string[]): Promise<Courses[]> {
    return this.courseService.searchByKeywords(keywords);
  }
   // Fetch All Courses (public)
   @Get()
   // @Public()
   //done
   @HttpCode(HttpStatus.OK) // 200: Successfully fetched resources
   async getAllCourses(): Promise<Courses[]> {
     return this.courseService.getAllCourses();
   }
 
   // Fetch a Specific Course by ID (public)
   @Get(':courseId')
   // @Public()
   //done
   @HttpCode(HttpStatus.OK) // 200: Successfully fetched the resource
   async getCourseById(@Param('courseId') courseId: string): Promise<Courses> {
     return this.courseService.getCourseById(courseId);
   }
}
