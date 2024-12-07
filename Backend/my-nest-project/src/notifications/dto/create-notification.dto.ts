import { IsString, IsArray, IsOptional, IsBoolean, ArrayNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  senderId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true }) // Validate each element of the array as a string
  receiverId: string[]; // Change to array of strings

  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean; // Default `false`, handled at the schema or service level
}
