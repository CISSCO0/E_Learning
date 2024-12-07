import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class CreateForumDto {
  @IsString()
   courseId: string;

  @IsArray()
  @IsString({ each: true })
  threads: string[] = [];

  @IsString()
  
  instructorId: string; // ID of the instructor moderating the forum
  
}
