import { IsArray, IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
import { RegisterRequestDto } from './RegisterRequestDto';
export class RegisterInstructorDto extends RegisterRequestDto {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    students?: string[] = []; 
  
    @IsNotEmpty()
    @IsString()
    field: string; 
  
    
    @IsInt()
    rating_avg?: number = 0; 
  }
  