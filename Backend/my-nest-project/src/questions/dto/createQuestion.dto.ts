import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  answer: string;

  @IsNotEmpty()
  @IsString()
  level: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}
