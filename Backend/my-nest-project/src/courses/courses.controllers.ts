
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards , Query  } from '@nestjs/common';
import { CoursesService } from './courses.services';
import { Courses } from './models/courses.schema';
import { CreateCourseDto } from './dto/create.course.dto';
import { UpdateCourseDto } from './dto/update.course.dto';
import { HttpCode, HttpStatus } from '@nestjs/common'; // to manage HTTP status codes
import { Role, Roles } from '../auth/decorators/roles.decorator';
import { Public} from '../auth/decorators/public.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
import { AuthGuard} from '../auth/guards/authentication.guard';
@Controller('courses')
@UseGuards(AuthorizationGuard)
@UseGuards(AuthGuard)
export class CoursesController {
  constructor(private courseService: CoursesService) {}

  // Create a Course
  @Post() //done testing  no logs created 
  @Roles(Role.Instructor)
   @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED) // 201: Resource successfully created
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Courses> {
    return this.courseService.create(createCourseDto);
  }

  // Update a Course 
  @Put(':courseId')//done 
  @Roles(Role.Instructor)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK) // 200: Successfully updated the resource
  async update(
    @Param('courseId') courseId: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Courses> {
    return this.courseService.update(courseId, updateCourseDto);
  }

  // Update a Course Rating 
  @Put(':courseId/rating')//done 
   @Roles(Role.Instructor)
   @Roles(Role.Admin)
  async updateRating(@Param('courseId') courseId: string, @Body('rating') rating: number) {
    if (rating<=10&&rating>=0)
    return this.courseService.updateRating(courseId, rating);
    else return "Rating must be between 0 and 10.";
  }

  // Delete a Course
  @Delete(':courseId')//done testing  //logs not done 
   @Roles(Role.Instructor)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK) // 204: Successfully deleted,
  async delete(@Param('courseId') courseId: string){
    const message = await this.courseService.delete(courseId);
    return message;
  }

  // Fetch All Courses (for admins/instructors)
  //done
  @Get('public')
   @Roles(Role.Instructor)
   @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK) // 200: Successfully fetched resources
  async findAll(): Promise<Courses[]> {
    return this.courseService.findAll();
  }

  // Fetch a Specific Course by ID (for admins/instructors)
  @Get('public/:courseId')
  //done
   @Roles(Role.Instructor)
   @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK) // 200: Successfully fetched the resource
  async findOne(@Param('courseId') courseId: string): Promise<Courses> {
    return this.courseService.findOne(courseId);
  }

  // Search Courses by Keywords for All Roles
  @Get('searchpublic')
  @Public()
  //done 
  @HttpCode(HttpStatus.OK) // 200: Successfully fetched the resources
  @Get('searchpublic')
  async searchCoursesPublic(@Query('keywords') keywords: string): Promise<Courses[]> {
      // Convert comma-separated string to an array
      const keywordArray = keywords.split(',').map(keyword => keyword.toLowerCase());
  
      return this.courseService.searchByKeywords(keywordArray);
  }
  

  // Search Courses by Keywords for Instructors/Admins
  @Get('search')
   @Roles(Role.Instructor)
   @Roles(Role.Admin)
  //done
  @HttpCode(HttpStatus.OK)
  async searchCourses(@Query('keywords') keywords: string[]): Promise<Courses[]> {
    return this.courseService.searchByKeywords(keywords);
  }
   // Fetch All Courses (public)
   @Get()
   @Public()
   //done
   @HttpCode(HttpStatus.OK) // 200: Successfully fetched resources
   async getAllCourses(): Promise<Courses[]> {
     return this.courseService.getAllCourses();
   }
 
   // Fetch a Specific Course by ID (public)
   @Get(':courseId')
   @Public()
   //done
   @HttpCode(HttpStatus.OK) // 200: Successfully fetched the resource
   async getCourseById(@Param('courseId') courseId: string): Promise<Courses> {
     return this.courseService.getCourseById(courseId);
   }
}
