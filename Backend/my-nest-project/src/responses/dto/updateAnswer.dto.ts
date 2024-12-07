import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAnswerDto {
  @IsNotEmpty()
  @IsString()
  questionId: string; 

  @IsNotEmpty()
  @IsString()
  answer: string; 
}
