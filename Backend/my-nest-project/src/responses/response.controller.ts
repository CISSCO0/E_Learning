import { 
    Controller, 
    Post, 
    Body, 
    Get, 
    Param, 
    Delete, 
    Patch, 
    UseGuards
  } from '@nestjs/common';
  import { ResponsesService } from './response.service';
  import { CreateResponseDto } from './dto/createResponse.dto';
// import { AuthGuard } from 'src/auth/guards/authentication.guard';
// import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';
// import { Role, Roles } from 'src/auth/decorators/roles.decorator';
// import { Student } from 'src/models/student.Schema';
  //@UseGuards(AuthGuard, AuthorizationGuard)
  @Controller('responses')
  export class ResponsesController {
    constructor(private responsesService: ResponsesService) {}
  
     // Submit a response
  @Post(':userId/:quizId')
  //@Roles(Role.Student)
  async submitResponse(
    @Param('userId') userId: string,
    @Param('quizId') quizId: string,
    @Body() body: { answers: { question_id: string; answer: string }[] },
  ) {
    return await this.responsesService.submitResponse(userId, quizId, body.answers);
  }

  @Delete('quiz/:quizId')
  async deleteResponsesByQuizId(@Param('quizId') quizId: string): Promise<void> {
    return await this.responsesService.deleteResponsesByQuizId(quizId);
  }

    // Get responses by user ID
    
    @Get('user/:userId')
    ////@Roles(Role.Student,Role.Instructor)
    async getResponsesByUserId(@Param('userId') userId: string) {
      return await this.responsesService.getResponsesByUserId(userId);
    }
    @Get()
    async getAllResponses() {
      return await this.responsesService.getAllResponses();
    }
  
    @Get('quiz/:quizId')
    //@Roles(Role.Student,Role.Instructor)
    async getResponsesByQuizId(@Param('quizId') quizId: string) {
      return await this.responsesService.getResponsesByQuizId(quizId);
    }
  
    @Get(':responseId')
    //@Roles(Role.Student,Role.Instructor)
    async getResponseById(@Param('responseId') responseId: string) {
      return await this.responsesService.getResponseById(responseId);
    }
  
    @Delete(':responseId')
    //@Roles(Role.Instructor)
    async deleteResponseById(@Param('responseId') responseId: string) {
      return await this.responsesService.deleteResponseById(responseId);
    }
  
    @Patch(':responseId')
    //@Roles(Role.Instructor)
    async updateResponseById(
      @Param('responseId') responseId: string,
      @Body() updateData: Partial<CreateResponseDto>,
    ) {
      return await this.responsesService.updateResponseById(responseId, updateData);
    }
   
    

//      @Patch(':responseId/answers')
//   async addAnswer(
//     @Param('responseId') responseId: string,
//     @Body() updateAnswerDto: UpdateAnswerDto,
//   ) {
//     return await this.responsesService.addAnswer(responseId, updateAnswerDto);
//   }
  }
  