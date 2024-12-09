import { IsString, IsOptional } from 'class-validator';

export class UpdateLogDto {
  @IsString()
  readonly id: string;

  @IsOptional() // Marks the field as optional for updates
  @IsString()
  event?: string; // Change 'content' to 'event' to match the schema

  @IsOptional() // Marks the field as optional for updates
  @IsString()
  adminId?: string;
}
