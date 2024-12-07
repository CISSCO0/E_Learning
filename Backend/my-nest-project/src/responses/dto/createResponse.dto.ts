import { IsNotEmpty, IsString, IsArray, IsNumber, IsDate } from 'class-validator';

export class CreateResponseDto {
  @IsNotEmpty()
  @IsString()
  userId: string; 

  @IsNotEmpty()
  @IsString()
  quizId: string; 

  @IsNotEmpty()
  @IsArray()
  answers: { questionId: string; answer: string }[]; 

  @IsNotEmpty()
  @IsNumber()
  score: number;

  @IsNotEmpty()
  @IsDate()
  submittedAt: Date;
}
