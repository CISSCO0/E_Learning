import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateThreadDto {
  @IsString()
   title: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
   messages: string[];
   content: string;
}
