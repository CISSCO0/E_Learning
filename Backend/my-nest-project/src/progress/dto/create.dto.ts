import { IsArray, IsDate, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateProgressDto {
  @IsString()
  user_id: string;

  @IsString()
  course_id: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  completion_percentage: number = 0 ;

  @IsDate()
  last_accessed: Date;

  @IsArray()
  @IsString({ each: true })
  performance: string[]=[]//get avergae proformnce    // somehow put it in the certificates;
  // api calculate ur fianl performance

  @IsArray()
  @IsString({ each: true })
  modulesId: string[]=[];
}

