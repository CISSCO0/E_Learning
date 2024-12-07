import { RegisterRequestDto } from './RegisterRequestDto';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
export class RegisterAdminDto extends RegisterRequestDto {
  
  @IsNotEmpty()
  @IsString()
  roleId: string;

  
  user_id: string;
  } 
  