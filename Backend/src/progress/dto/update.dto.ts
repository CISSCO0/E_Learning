import { IsNotEmpty, IsString, IsNumber, IsDate, IsArray, Min, Max } from 'class-validator';

export class UpdateProgressDto {
  @IsString()
  @IsNotEmpty()

  user_id?: string;

  @IsString()
  @IsNotEmpty()
  course_id?: string;

  @IsDate()
  last_accessed?: Date;

  @IsArray()
  @IsString({ each: true })
  performance?: string[];

  @IsArray()
  @IsString({ each: true })
  modulesId?: string[];
}
