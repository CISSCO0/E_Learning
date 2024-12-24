import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Quizzes } from './models/quizzes.schema';
import { CreateQuizDto } from './dto/createQuiz.dto';
import { QuestionBankService } from '../questionBank/questionBank.service';
import { ResponsesService } from '../responses/response.service';
import { Question } from '../questions/models/questions.schema';
import { Response } from '../responses/models/responses.schema';
import { QuestionBank } from 'src/questionBank/models/questionBank.schema';
import { pass } from './dto/pass.dto';

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
  async getQuizzesByModuleId(module_id: string): Promise<Quizzes[]> {
    return await this.quizModel.find({ module_id }).exec();

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
   async startQuiz(quiz_id: string, userId: string): Promise<any> {
    const response = await this.responseModel.findOne({ quiz_id: quiz_id, user_id: userId });
    if (response) {
      console.log("oo")
      throw new BadRequestException('Quiz already started for this student');
    }
//console.log(quizId + " " + userId)
    // Initialize response
    const newResponse = new this.responseModel({
      quiz_id: quiz_id, // Matches `quizId` in DTO
      user_id: userId, // Matches `userId` in DTO
      answers: [], // Matches `answers` in DTO (empty at creation)
      score: 0, // Matches `score` in DTO
      submitted_at: new Date(), // Matches `submittedAt` in DTO
    });
    await newResponse.save();
   // console.log(quiz_id)
  
    const quiz =  await this.quizModel.findById(quiz_id).exec();
   // console.log(JSON.stringify(quiz));
    if (!quiz) {
      console.log("oo2")
      throw new NotFoundException('Quiz not found');
    }
    // Fetch first question (medium by default)
    
    const firstQuestion = await this.getNextQuestion(quiz.questionBank_id,quiz_id, userId, quiz.level);
    console.log(firstQuestion.level)
    return { question: firstQuestion };

    //log here?
  }

  // Submit an answer and fetch the next question
  async submitAnswer(quiz_id: string, userId: string, questionId: string, answer: string): Promise<any> {
    const response = (await this.responseModel.findOne({ quiz_id: quiz_id, user_id: userId }).exec()) ;
    if (!response) {
      throw new NotFoundException('Quiz not started');
    }

    // Fetch the question
    const question = await this.questionModel.findById(questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }
//console.log("ans " + answer)
    // Check the answer and update score
    const isCorrect = question.correctAnswer === answer;
    if (isCorrect) {
      response.score += 1;
    }
    //console.log("oooo " + question.correctAnswer + " " + answer)
    // Add to answers array
    response.answers.push({ question_id: questionId, answer });
    await response.save();
   
    const quiz =  await this.quizModel.findById(quiz_id).exec();
    // if (quiz.numberOfQuestions.valueOf() >= response.answers.length) {
    //   return { isCorrect, nextQuestion };
    // }
    // Fetch the next question
    const nextDifficulty = this.adjustDifficulty(isCorrect, question.level);
    const nextQuestion = await this.getNextQuestion(quiz.questionBank_id,quiz_id, userId, nextDifficulty);
console.log(nextDifficulty)
    return { isCorrect, nextQuestion };
  }

  // End quiz
  async endQuiz(quizId: string, userId: string, pass:pass): Promise<any> {
    const response = await this.responseModel.findOne({ quiz_id: quizId, user_id: userId });
    if (!response) {
      throw new NotFoundException('Quiz not started');
    }
if(!pass.pass){
  await this.responseModel.findByIdAndDelete(response._id);
}
    // Finalize and return the score
    return { score: response.score, total: response.answers.length };

    //log here ??
  }

  // Get the next question based on difficulty
 // Get the next question based on difficulty and type
private async getNextQuestion(questionBank_id: string, quiz_id: string, user_id: string, difficulty: string): Promise<any> {
  // Find the user's response for the quiz
  const response = await this.responseModel.findOne({ quiz_id, user_id }).exec();
  if (!response) {
    throw new NotFoundException('Quiz not started');
  }

  // Extract already answered question IDs (ensure they are ObjectIds)
  const answeredQuestions = response.answers.map(a => new Types.ObjectId(a.question_id));

  // Retrieve the question bank
  const questionBank = await this.questionBankModel.findById(questionBank_id).exec();
  if (!questionBank) {
    console.log("tmm")
    throw new NotFoundException('Question bank not found');
  }

  // Filter the questions that have not been answered
  const availableQuestions = questionBank.questions.filter(
    (question_id: Types.ObjectId) => !answeredQuestions.some(answeredId => answeredId.equals(question_id))
  );

  // Retrieve the quiz details to check the type
  const quiz = await this.quizModel.findById(quiz_id).exec();
  if (!quiz) {
    throw new NotFoundException('Quiz not found');
  }

  const quizType = quiz.type; // mcq, true/false, or both

  // Find the next question based on the difficulty and type
  const nextQuestion = await this.questionModel
    .findOne({
      _id: { $in: availableQuestions },
      level: difficulty,
      ...(quizType !== 'both' && { type: quizType }), // Filter by type if not "both"
    })
    .exec();

  if (!nextQuestion) {
    throw new NotFoundException('No question matching the criteria found');
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
      const { moduleId, numberOfQuestions, difficultyLevel, questionBank_id, type } = createQuizDto;
  
      // Check if the question bank exists
      const questionBank = await this.questionBankModel.findById(questionBank_id).exec();
      if (!questionBank) {
        throw new NotFoundException('Question bank not found');
      }
  
      // Ensure that the number of questions is not greater than the number of available questions in the question bank
      if (numberOfQuestions > questionBank.questions.length) {
        throw new BadRequestException('Not enough questions in the question bank');
      }
  // console.log(difficultyLevel)
      // Create a new quiz
      const newQuiz = new this.quizModel({
        module_id: moduleId,
        numberOfQuestions: numberOfQuestions,
        level: difficultyLevel,
        questionBank_id: questionBank_id,
        createdAt: new Date(),
        updatedAt: new Date(),
        type
      });
  
      // Save the quiz to the database
      const savedQuiz = await newQuiz.save();
  
      // Return the created quiz
      return savedQuiz;

      //log here
    }
  
}
