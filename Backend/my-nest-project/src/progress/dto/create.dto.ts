import { IsArray, IsDate, IsNumber, IsString, Min, Max } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProgressDto {
  @IsString()
  user_id: Types.ObjectId ;

  @IsString()
  course_id:  Types.ObjectId ;

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

