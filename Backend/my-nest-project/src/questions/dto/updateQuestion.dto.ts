import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  answer?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
