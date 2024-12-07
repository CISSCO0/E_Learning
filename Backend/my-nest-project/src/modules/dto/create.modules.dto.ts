import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content: string;

  rating : Number =0;
  resources : string [] =[];

}
