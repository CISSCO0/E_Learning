import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class UpdateChatDto {
     users: string[]; // Array of updated user IDs
  }
  