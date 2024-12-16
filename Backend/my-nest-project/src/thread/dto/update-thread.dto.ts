import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateThreadDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  messages?: string[];
}
