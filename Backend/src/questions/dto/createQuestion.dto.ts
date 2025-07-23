import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateIf } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  level: string;

  @IsNotEmpty()
  @IsString()
  type: string; // e.g., 'mcq' or 'true/false'

  @IsNotEmpty()
  @IsString()
  content: string;

  @ValidateIf((dto) => dto.type === 'mcq')
  @IsArray()
  @IsNotEmpty({ each: true })
  possibleAnswers?: string[];

  @IsNotEmpty()
  @IsString()
  correctAnswer: string;
}
