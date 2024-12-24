import { IsOptional, IsString, IsArray, ValidateIf } from 'class-validator';

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @ValidateIf((dto) => dto.type === 'mcq')
  @IsArray()
  @IsOptional()
  possibleAnswers?: string[];

  @IsOptional()
  @IsString()
  correctAnswer?: string;
}
