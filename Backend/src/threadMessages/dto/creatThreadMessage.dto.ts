import { IsNotEmpty, IsString } from 'class-validator';

export class CreateThreadMessageDto {
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  @IsString()
  threadId: string;
}
