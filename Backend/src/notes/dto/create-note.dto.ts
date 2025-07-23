import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  course_id: string;

  @IsString()
  //@IsNotEmpty()
  content: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  last_updated: Date;

  @IsString()
  @IsNotEmpty()
  title: string;  // Title of the note
}
