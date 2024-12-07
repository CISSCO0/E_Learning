import { Controller, Get, Post, Delete, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';
import { Roles, Role } from 'src/auth/decorators/roles.decorator';
@UseGuards(AuthGuard, AuthorizationGuard)
@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  // Get question by ID
  @Get(':id')
  @Roles(Role.Student,Role.Instructor)
  async getQuestionById(@Param('id') id: string) {
    return await this.questionsService.getQuestionById(id);
  }

  // Create a new question
  @Post()
  @Roles(Role.Instructor)
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return await this.questionsService.createQuestion(createQuestionDto);
  }

  // Delete question by ID (and associated responses)
  @Delete(':id')
  @Roles(Role.Instructor)
  async deleteQuestionById(@Param('id') id: string) {
    await this.questionsService.deleteQuestionById(id);
    return { message: 'Question and related responses deleted successfully' };
  }

  // Update a question by ID
  @Patch(':id')
  @Roles(Role.Instructor)
  async updateQuestionById(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return await this.questionsService.updateQuestionById(id, updateQuestionDto);
  }
}
