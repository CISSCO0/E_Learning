import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateQuestionBankDto } from './dto/createQuestionBank.dto';
import { UpdateQuestionBankDto } from './dto/updateQuestionBank.dto';
import { InsertQuestionDto } from './dto/insertQuestion.dto';
import { QuestionBank } from './models/questionBank.schema';
import { Question } from '../questions/models/questions.schema'; // Assuming a Question model exists

@Injectable()
export class QuestionBankService {
  constructor(
    @InjectModel('QuestionBank') private questionBankModel: Model<QuestionBank>,
    @InjectModel('Question') private questionModel: Model<Question>,
  ) {}

  // Get question bank by ID
  async getQuestionBankById(id: string): Promise<QuestionBank> {
    const questionBank = await this.questionBankModel.findById(id).exec();
    if (!questionBank) {
      throw new NotFoundException('Question bank not found');
    }
    return questionBank;
  }

  // Get question bank by module ID
  async getQuestionBankByModuleId(module_id: string): Promise<QuestionBank> {
    const questionBank = await this.questionBankModel.findOne({ module_id }).exec();
    if (!questionBank) {
      throw new NotFoundException('Question bank not found');
    }
    return questionBank;
  }

  // Create a new question bank
  async createQuestionBank(
    createQuestionBankDto: CreateQuestionBankDto,
  ): Promise<QuestionBank> {
    const newQuestionBank = new this.questionBankModel(createQuestionBankDto);
    return await newQuestionBank.save();
  }

  // Update a question bank
  async updateQuestionBank(
    id: string,
    updateQuestionBankDto: UpdateQuestionBankDto,
  ): Promise<QuestionBank> {
    const updatedQuestionBank = await this.questionBankModel
      .findByIdAndUpdate(id, updateQuestionBankDto, { new: true })
      .exec();
    if (!updatedQuestionBank) {
      throw new NotFoundException('Question bank not found');
    }
    return updatedQuestionBank;
  }

  // Delete a question bank and associated questions
  async deleteQuestionBank(id: string): Promise<void> {
    const questionBank = await this.getQuestionBankById(id);
    if (!questionBank) {
      throw new NotFoundException('Question bank not found');
    }

    // Delete all questions in the question bank
    if (questionBank.questions.length > 0) {
      await this.questionModel.deleteMany({ _id: { $in: questionBank.questions } }).exec();
    }

    // Delete the question bank itself
    await this.questionBankModel.findByIdAndDelete(id).exec();
  }

  // Insert a question into the question bank
  async insertQuestion(
    questionBankId: string, // ID of the question bank
    insertQuestionDto: InsertQuestionDto, // Contains questionId
  ): Promise<QuestionBank> {
    // Fetch the question bank by its ID
    const questionBank = await this.getQuestionBankById(questionBankId);
    if (!questionBank) {
      throw new NotFoundException('Question bank not found');
    }
  
    // Validate the question ID by checking if the question exists
    const question = await this.questionModel
      .findById(insertQuestionDto.questionId)
      .exec();
    if (!question) {
      throw new NotFoundException('Question not found');
    }
  
    // Add the question ID to the question bank's questions array if not already present
    const questionId = new mongoose.Types.ObjectId(insertQuestionDto.questionId);
    if (!questionBank.questions.some((q) => q.equals(questionId))) {
      questionBank.questions.push(questionId);
    }
  
    // Save the updated question bank
    return await questionBank.save();
  }
  
  // Remove a question from the question bank
  async removeQuestion(id: string, questionId: string): Promise<QuestionBank> {
    const questionBank = await this.getQuestionBankById(id);
  
    // Convert string questionId to ObjectId
    const questionObjectId = new mongoose.Types.ObjectId(questionId);
  
    // Remove the question ID from the questions array
    questionBank.questions = questionBank.questions.filter(
      (q) => !q.equals(questionObjectId), // Use equals() to compare ObjectIds
    );
  
    // Optionally delete the question itself from the database
    await this.questionModel.findByIdAndDelete(questionObjectId).exec();
  
    return await questionBank.save();
  }
}
