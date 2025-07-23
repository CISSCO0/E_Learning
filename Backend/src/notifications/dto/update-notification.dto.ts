import { IsString, IsArray, IsOptional, IsBoolean, ArrayNotEmpty } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  senderId?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true }) // Validate each element of the array as a string
  receiverId?: string[];

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean; // Optional for updates
}
