import { IsString } from 'class-validator';

export class CreateLogDto {
  @IsString()
  readonly event: string; // Match schema

  @IsString()
  readonly userId: string; // Required in schema

  @IsString()
  readonly adminId: string; // Required in schema
}
