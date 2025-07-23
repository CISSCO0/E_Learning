import { Controller,Get,Post,Patch, Delete,Param,Body, Query, HttpCode, HttpStatus, UseGuards, UnauthorizedException, Req,} from '@nestjs/common';
  import { QuizzesService } from './quizzes.service';
  import { CreateQuizDto } from './dto/createQuiz.dto';
  import { UpdateQuizDto } from './dto/updateQuiz.dto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';
import { Roles, Role } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { SubmitAnswerDto } from './dto/submitAnswer.dto';
import {pass} from './dto/pass.dto'
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
  
    
  
   /**
   * Start a quiz for the user
   * @param quizId - ID of the quiz to start
   * @param req - The incoming HTTP request
   */
  @Post(':id/start')
  async startQuiz(@Param('id') quizId: string, @Req() req: Request): Promise<any> {
    // Extract token from cookies or authorization header
    const token = this.extractToken(req);
    
    if (!token) {
      throw new UnauthorizedException('Authentication token is required');
    }

    // Decode token to get userId
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, 'clown'); // Replace 'your-secret-key' with your JWT secret
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
   //console.log('wooo: ', decodedToken);
    const userId = decodedToken.userid; // Assuming 'id' is the field in your JWT payload
    
    //console.log(`User ID extracted from token: ${userId}`);

    // Delegate the rest of the logic to the service
    return await this.quizzesService.startQuiz(quizId, userId);
  }

  /**
   * Extracts the token from cookies or Authorization header
   * @param request - The incoming HTTP request
   * @returns The JWT token if present
   */
  private extractToken(request: Request): string | undefined {
    // Check cookies for the token
    if (request.cookies && request.cookies.token) {
      return request.cookies.token;
    }

    // Check Authorization header for the token
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }

    return undefined;
  }

  /**
   * Start a quiz for the user
   * @param quizId - ID of the quiz to start
   * @param req - The incoming HTTP request
   */
  @Post(':id/submit')
  async submitAnswer(@Param('id') quizId: string, @Req() req: Request,@Body() submitAnswerDto: SubmitAnswerDto) {
    const { questionId, answer } = submitAnswerDto;
    const token = this.extractToken(req);
    
    if (!token) {
      throw new UnauthorizedException('Authentication token is required');
    }

    // Decode token to get userId
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, 'clown'); // Replace 'your-secret-key' with your JWT secret
    } catch (err) {
      console.log("no")
      throw new UnauthorizedException('Invalid or expired token');
    }
    console.log('wooo: ', decodedToken);
    const userId = decodedToken.userid;

    return await this.quizzesService.submitAnswer(quizId, userId, questionId, answer);
  }
    // End quiz
    @Post(':id/end')
    @Roles(Role.Student,Role.Instructor)
    async endQuiz(
      @Param('id') quizId: string, @Req() req: Request,
      @Body() pass: pass
    ) {
      const token = this.extractToken(req);
    
    if (!token) {
      throw new UnauthorizedException('Authentication token is required');
    }

    // Decode token to get userId
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, 'clown'); // Replace 'your-secret-key' with your JWT secret
    } catch (err) {
      console.log("no")
      throw new UnauthorizedException('Invalid or expired token');
    }
    console.log('wooo: ', decodedToken);
    const userId = decodedToken.userid;
      return await this.quizzesService.endQuiz(quizId, userId,pass);
    }
  }
  