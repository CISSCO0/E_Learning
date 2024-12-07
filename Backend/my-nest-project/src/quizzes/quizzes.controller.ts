import { Controller,Get,Post,Patch, Delete,Param,Body, Query, HttpCode, HttpStatus, UseGuards,} from '@nestjs/common';
  import { QuizzesService } from './quizzes.service';
  import { CreateQuizDto } from './dto/createQuiz.dto';
  import { UpdateQuizDto } from './dto/updateQuiz.dto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';
import { Roles, Role } from 'src/auth/decorators/roles.decorator';
  
  @Controller('quizzes')
  @UseGuards(AuthGuard, AuthorizationGuard)
  export class QuizzesController {
    constructor(private readonly quizzesService: QuizzesService) {}
  
    @Post()
    async createQuiz(@Body() createQuizDto: CreateQuizDto) {
      return this.quizzesService.createQuiz(createQuizDto);
    }

    // Get all quizzes
    @Get()
    @Roles(Role.Student,Role.Admin,Role.Instructor)
    async getAllQuizzes() {
      return await this.quizzesService.getAllQuizzes();
    }
  
    // Get quiz by ID
    @Get(':id')
    @Roles(Role.Student,Role.Admin,Role.Instructor)
    async getQuizById(@Param('id') id: string) {
      return await this.quizzesService.getQuizById(id);
    }
  
    // Get quizzes by module ID
    @Get('module/:moduleId')
    @Roles(Role.Student,Role.Admin,Role.Instructor)
    async getQuizzesByModuleId(@Param('moduleId') moduleId: string) {
      return await this.quizzesService.getQuizzesByModuleId(moduleId);
    }
  
    
  
    // Update quiz by ID
    @Patch(':id')
    @Roles(Role.Instructor)
    async updateQuizById(
      @Param('id') id: string,
      @Body() updateQuizDto: Partial<UpdateQuizDto>,
    ) {
      return await this.quizzesService.updateQuizById(id, updateQuizDto);
    }
  
    // Delete quiz by ID
    @Delete(':id')
    @Roles(Role.Admin,Role.Instructor)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteQuizById(@Param('id') id: string) {
      await this.quizzesService.deleteQuizById(id);
    }
  
    // Start a quiz
    @Post(':id/start')
    @Roles(Role.Student)
    async startQuiz(
      @Param('id') quizId: string,
      @Query('userId') userId: string,
    ) {
      return await this.quizzesService.startQuiz(quizId, userId);
    }
  
    // Submit an answer and fetch the next question
    @Post(':id/submit')
    @Roles(Role.Student)
    async submitAnswer(
      @Param('id') quizId: string,
      @Query('userId') userId: string,
      @Body() submitAnswerDto: { questionId: string; answer: string },
    ) {
      const { questionId, answer } = submitAnswerDto;
      return await this.quizzesService.submitAnswer(quizId, userId, questionId, answer);
    }
  
    // End quiz
    @Post(':id/end')
    @Roles(Role.Student)
    async endQuiz(
      @Param('id') quizId: string,
      @Query('userId') userId: string,
    ) {
      return await this.quizzesService.endQuiz(quizId, userId);
    }
  }
  