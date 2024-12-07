import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class UpdateForumDto {
    @IsArray()
    threads ?: string[]; // Array of thread IDs associated with the forum
  }
  