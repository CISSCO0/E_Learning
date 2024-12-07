import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { QuestionBankService } from './questionBank.service';
import { CreateQuestionBankDto } from './dto/createQuestionBank.dto';
import { UpdateQuestionBankDto } from './dto/updateQuestionBank.dto';
import { InsertQuestionDto } from './dto/insertQuestion.dto';
import { Roles, Role } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';

@Controller('question-banks')
@UseGuards(AuthGuard, AuthorizationGuard)
export class QuestionBankController {
  constructor(private questionBankService: QuestionBankService) {}

  @Get(':id')
  @Roles(Role.Student,Role.Instructor,Role.Admin)
  async getQuestionBankById(@Param('id') id: string) {
    return await this.questionBankService.getQuestionBankById(id);
  }
//test with menna
  @Get('module/:moduleId')
  @Roles(Role.Student,Role.Instructor,Role.Admin)
  async getQuestionBankByModuleId(@Param('moduleId') moduleId: string) {
    return await this.questionBankService.getQuestionBankByModuleId(moduleId);
  }

  @Post()
  @Roles(Role.Instructor)
  async createQuestionBank(@Body() createQuestionBankDto: CreateQuestionBankDto) {
    return await this.questionBankService.createQuestionBank(createQuestionBankDto);
  }

  @Put(':id')
  @Roles(Role.Instructor)
  async updateQuestionBank(
    @Param('id') id: string,
    @Body() updateQuestionBankDto: UpdateQuestionBankDto,
  ) {
    return await this.questionBankService.updateQuestionBank(id, updateQuestionBankDto);
  }

  @Delete(':id')
  @Roles(Role.Instructor)
  async deleteQuestionBank(@Param('id') id: string) {
    await this.questionBankService.deleteQuestionBank(id);
    return { message: 'Question bank deleted successfully' };
  }

  @Post(':id/questions')
  @Roles(Role.Instructor)
  async insertQuestion(
    @Param('id') id: string,
    @Body() insertQuestionDto: InsertQuestionDto,
  ) {
    return await this.questionBankService.insertQuestion(id, insertQuestionDto);
  }
//id or dto???
  @Delete(':id/questions/:questionId')
  @Roles(Role.Instructor)
  async removeQuestion(
    @Param('id') id: string,
    @Param('questionId') questionId: string,
  ) {
    return await this.questionBankService.removeQuestion(id, questionId);
  }
}
