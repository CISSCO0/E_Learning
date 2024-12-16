import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
   content: string;  // The content of the message 

  @IsString()
  chatId: string;

  @IsString()
    senderId: string; // The ID of the user sending the message
  
}
