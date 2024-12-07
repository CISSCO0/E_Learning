import { IsNotEmpty, IsOptional, IsString, IsObject, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateConfigurationDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;  // Ensure 'id' is included and validated

  @IsObject()
  @IsOptional()
  settings?: Record<string, string>;

  @IsString()
  @IsOptional()
  updatedBy?: string;  // Track the updater
}
