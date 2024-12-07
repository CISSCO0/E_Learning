import { IsString, IsNotEmpty } from 'class-validator';

export class CreateThreadForForumDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  initialMessage: string;

  @IsString()
  @IsNotEmpty()
  senderId: string;
}
