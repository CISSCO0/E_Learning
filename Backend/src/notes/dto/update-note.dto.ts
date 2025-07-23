import { IsString, IsOptional, IsDate } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  user_id?: string;

  @IsString()
  @IsOptional()
  course_id?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsDate()
  @IsOptional()
  last_updated?: Date;

  @IsString()
  title: string;  // Title of the note
}
