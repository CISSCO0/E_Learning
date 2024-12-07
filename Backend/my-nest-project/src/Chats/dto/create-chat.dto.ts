import { IsArray, IsString, ArrayNotEmpty, ArrayMinSize, IsOptional } from 'class-validator';

export class CreateChatDto {
  static users(users: any): import("../models/chat.schema").Chat | PromiseLike<import("../models/chat.schema").Chat> {
    throw new Error('Method not implemented.');
  }
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(2) // Ensure at least 2 elements are in the array
  @IsString({ each: true })
  users: string[];

  @IsArray()
  @IsString({ each: true })
  messages?: string[];

  @IsString()
  @IsOptional()
  title?: string;
}
