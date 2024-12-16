import { IsArray, IsString , IsOptional } from 'class-validator';

export class UpdateforumDto {
    @IsOptional()
    key: string[] = [];

    @IsArray()
    threads ?: string[];
  }