import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose,{ Model, Types } from 'mongoose';
import { CreateResponseDto } from './dto/createResponse.dto';
import { Response } from './models/responses.schema'; // Import the MongoDB Response schema
import { Question } from 'src/questions/models/questions.schema';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectModel('Response') private responseModel: mongoose.Model<Response>,
    @InjectModel('Question') private readonly questionModel: Model<Question>,
  ) {}

  // // Create a new response
  // async createResponse(createResponseDto: CreateResponseDto): Promise<Response> {
  //   const newResponse = new this.responseModel(createResponseDto);
  //   return await newResponse.save();
  // }

  // Get all responses
  async getAllResponses(): Promise<Response[]> {
    return await this.responseModel.find().exec();
  }

  async deleteResponsesByQuizId(quiz_id: string): Promise<void> {
    const result = await this.responseModel.deleteMany({
      quiz_id: new Types.ObjectId(quiz_id),
    }).exec();

    if (result.deletedCount === 0) {
      throw new Error('No responses found for the given quiz ID.');
    }
  }
  // Get responses by quiz ID
  async getResponsesByQuizId(quiz_id: string): Promise<Response[]> {
    return await this.responseModel
      .find({ quiz_id: new Types.ObjectId(quiz_id) })
      .exec();
  }

  // Get a response by response ID
  async getResponseById(responseId: string): Promise<Response> {
    const response = await this.responseModel.findById(responseId).exec();
    if (!response) {
      throw new NotFoundException('Response not found');
    }
    return response;
  }

  // Delete a response by response ID
  async deleteResponseById(responseId: string): Promise<{ message: string }> {
    const result = await this.responseModel.findByIdAndDelete(responseId).exec();
    if (!result) {
      throw new NotFoundException('Response not found');
    }
    return { message: 'Response deleted' };
  }

  // Update a response by response ID
  async updateResponseById(
    responseId: string,
    updateData: Partial<CreateResponseDto>,
  ): Promise<Response> {
    const updatedResponse = await this.responseModel
      .findByIdAndUpdate(responseId, updateData, { new: true })
      .exec();
    if (!updatedResponse) {
      throw new NotFoundException('Response not found');
    }
    return updatedResponse;
  }
// Submit a response and calculate the score
async submitResponse(
  userId: string,
  quizId: string,
  answers: { question_id: string; answer: string }[],
): Promise<Response> {
  // Fetch all the questions related to the given answers
  const questionIds = answers.map((a) => a.question_id);
  const questions = await this.questionModel.find({ _id: { $in: questionIds } }).exec();

  if (!questions || questions.length !== answers.length) {
    throw new NotFoundException('Some questions were not found.');
  }

  // Calculate the score
  let score = 0;
  answers.forEach((response) => {
    const question = questions.find((q) => q._id.toString() === response.question_id);
    if (question && question.answer === response.answer) {
      score ++; // Add points for the correct answer
    }
  });

  // Create a new response
  const newResponse = new this.responseModel({
    user_id: userId,
    quiz_id: quizId,
    answers,
    score,
    submitted_at: new Date(),
  });

  return await newResponse.save();
}
async getResponsesByUserId(userId: string): Promise<Response[]> {
  return await this.responseModel.find({ user_id: userId }).exec();
}

async getResponsesByUserAndQuizzes(
  userId: string,
  quizIds: string[],
): Promise<Response[]> {
  return await this.responseModel
    .find({
      user_id: userId,
      quiz_id: { $in: quizIds.map((id) => new Types.ObjectId(id)) },
    })
    .exec();
}

}
