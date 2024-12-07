import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Quizzes } from './models/quizzes.schema';
import { CreateQuizDto } from './dto/createQuiz.dto';
import { QuestionBankService } from '../questionBank/questionBank.service';
import { ResponsesService } from '../responses/response.service';
import { Question } from '../questions/models/questions.schema';
import { Response } from '../responses/models/responses.schema';
import { QuestionBank } from 'src/questionBank/models/questionBank.schema';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel('Quizzes') private quizModel: Model<Quizzes>,
    @InjectModel('QuestionBank') private questionBankModel: Model<QuestionBank>,
    @InjectModel('Question') private questionModel: Model<Question>,
    @InjectModel('Response') private responseModel: Model<Response>,
  ) {}

  // Get all quizzes
  async getAllQuizzes(): Promise<Quizzes[]> {
    return await this.quizModel.find().exec();
  }

  // Get quiz by ID
  async getQuizById(id: string): Promise<Quizzes> {
    const quiz = await this.quizModel.findById(id).exec();
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }

  // Get quizzes by module ID
  async getQuizzesByModuleId(moduleId: string): Promise<Quizzes[]> {
    return await this.quizModel.find({ module_id: moduleId }).exec();
  }

  // Delete quiz by ID
  async deleteQuizById(id: string): Promise<void> {
    // Retrieve the quiz by ID
    const quiz = await this.quizModel.findById(id).exec();
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
  
    // Delete all responses associated with the quiz
    const responses = await this.responseModel.find({ quiz_id: id }).exec();
    if (responses.length > 0) {
      await this.responseModel.deleteMany({ quiz_id: id }).exec();
    }
  
    // Delete the quiz itself
    await this.quizModel.findByIdAndDelete(id).exec();

    //log here 
  }

  // Update quiz by ID
  async updateQuizById(id: string, updateQuizDto: Partial<CreateQuizDto>): Promise<Quizzes> {
    const updatedQuiz = await this.quizModel.findByIdAndUpdate(id, updateQuizDto, { new: true }).exec();
    if (!updatedQuiz) {
      throw new NotFoundException('Quiz not found');
    }
    return updatedQuiz;
  }

   // Start a quiz
   async startQuiz(quizId: string, userId: string): Promise<any> {
    const response = await this.responseModel.findOne({ quiz_id: quizId, user_id: userId });
    if (response) {
      throw new BadRequestException('Quiz already started for this student');
    }

    // Initialize response
    const newResponse = new this.responseModel({
      quiz_id: quizId,
      user_id: userId,
      answers: [],
      score: 0,
    });
    await newResponse.save();

    // Fetch first question (medium by default)
    const firstQuestion = await this.getNextQuestion(quizId, userId, 'medium');
    return { question: firstQuestion };

    //log here?
  }

  // Submit an answer and fetch the next question
  async submitAnswer(quizId: string, userId: string, questionId: string, answer: string): Promise<any> {
    const response = (await this.responseModel.findOne({ quiz_id: quizId, user_id: userId }).exec()) ;
    if (!response) {
      throw new NotFoundException('Quiz not started');
    }

    // Fetch the question
    const question = await this.questionModel.findById(questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // Check the answer and update score
    const isCorrect = question.answer === answer;
    if (isCorrect) {
      response.score += 1;
    }

    // Add to answers array
    response.answers.push({ question_id: questionId, answer });
    await response.save();

    // Fetch the next question
    const nextDifficulty = this.adjustDifficulty(isCorrect, question.level);
    const nextQuestion = await this.getNextQuestion(quizId, userId, nextDifficulty);

    return { isCorrect, nextQuestion };
  }

  // End quiz
  async endQuiz(quizId: string, userId: string): Promise<any> {
    const response = await this.responseModel.findOne({ quiz_id: quizId, user_id: userId });
    if (!response) {
      throw new NotFoundException('Quiz not started');
    }

    // Finalize and return the score
    return { score: response.score, total: response.answers.length };

    //log here ??
  }

  // Get the next question based on difficulty
  private async getNextQuestion(quizId: string, userId: string, difficulty: string): Promise<any> {
    const response = await this.responseModel.findOne({ quiz_id: quizId, user_id: userId });

    const answeredQuestions = response.answers.map(a => a.question_id);
    const questionBank = await this.questionBankModel.findOne({ quiz_id: quizId });

    const nextQuestion = await this.questionModel
  .findOne({
    _id: { $nin: answeredQuestions, $in: questionBank.questions },
    difficulty,
  })
  .exec();

    if (!nextQuestion) {
    throw new NotFoundException('No more questions available');
    }
    return nextQuestion;
  }

  // Adjust difficulty based on performance
  private adjustDifficulty(isCorrect: boolean, currentDifficulty: string): string {
    const difficultyOrder = ['easy', 'medium', 'hard'];

    const currentIndex = difficultyOrder.indexOf(currentDifficulty);
    if (isCorrect && currentIndex < difficultyOrder.length - 1) {
      return difficultyOrder[currentIndex + 1];
    } else if (!isCorrect && currentIndex > 0) {
      return difficultyOrder[currentIndex - 1];
    }
    return currentDifficulty;
  }

    // Create a new quiz
   async createQuiz(createQuizDto: CreateQuizDto): Promise<Quizzes> {
      const { moduleId, numberOfQuestions, difficultyLevel, questionBank_id } = createQuizDto;
  
      // Check if the question bank exists
      const questionBank = await this.questionBankModel.findById(questionBank_id).exec();
      if (!questionBank) {
        throw new NotFoundException('Question bank not found');
      }
  
      // Ensure that the number of questions is not greater than the number of available questions in the question bank
      if (numberOfQuestions > questionBank.questions.length) {
        throw new BadRequestException('Not enough questions in the question bank');
      }
  
      // Create a new quiz
      const newQuiz = new this.quizModel({
        module_id: moduleId,
        number_of_questions: numberOfQuestions,
        level: difficultyLevel,
        questionBank_id: questionBank_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  
      // Save the quiz to the database
      const savedQuiz = await newQuiz.save();
  
      // Return the created quiz
      return savedQuiz;

      //log here
    }
  
}
