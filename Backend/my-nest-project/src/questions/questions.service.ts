import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose,{ Model, Types } from 'mongoose';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { Question } from './models/questions.schema';
import { Response } from '../responses/models/responses.schema';
import { QuestionBank } from 'src/questionBank/models/questionBank.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel('Question') private questionModel: mongoose.Model<Question>,
    @InjectModel('Response') private responseModel: mongoose.Model<Response>,
    @InjectModel('QuestionBank') private questionBankModel: Model<QuestionBank>,
  ) {}

  // Get a question by ID
  async getQuestionById(questionId: string): Promise<Question> {
    const question = await this.questionModel.findById(questionId).exec();
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  // Create a new question
  async createQuestion(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const newQuestion = new this.questionModel(createQuestionDto);
    return await newQuestion.save();
  }

  // Delete a question and associated responses
  async deleteQuestionById(questionId: string): Promise<void> {
    const question = await this.questionModel.findById(questionId).exec();
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // Delete related responses
    await this.responseModel.updateMany(
      { 'answers.questionId': questionId },
      { $pull: { answers: { questionId } } },
    );

 // Convert questionId to ObjectId
 const questionObjectId = new mongoose.Types.ObjectId(questionId);

 // Remove the question from all question banks
 await this.questionBankModel.updateMany(
   { questions: questionObjectId },
   { $pull: { questions: questionObjectId } },
 );

    // Delete the question
    await this.questionModel.findByIdAndDelete(questionId).exec();
  }

  // Update a question by ID
  async updateQuestionById(
    questionId: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const updatedQuestion = await this.questionModel
      .findByIdAndUpdate(questionId, updateQuestionDto, { new: true })
      .exec();
    if (!updatedQuestion) {
      throw new NotFoundException('Question not found');
    }
    return updatedQuestion;
  }
}
