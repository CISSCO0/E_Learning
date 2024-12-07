import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  type: string; // Resource type (e.g., PDF, Video)

  @IsString()
  @IsNotEmpty()
  content: string; // Content of the resource (e.g., URL or file path)

  @IsOptional()
  @IsBoolean()
  outdated?: boolean; // Optional, default is false internally
}
