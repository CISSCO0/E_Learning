// create-configuration.dto.ts
import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class CreateConfigurationDto {
  @IsObject()
  @IsNotEmpty()
  settings: Record<string, string>; // Key-value pairs for configuration settings

  @IsString()
  @IsNotEmpty()
  createdBy: string; // Track who created it
}
