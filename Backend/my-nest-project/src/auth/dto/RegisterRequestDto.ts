import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsInt } from 'class-validator';

export class RegisterRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string; 

  @IsEmail()
  email: string; 

  @IsNotEmpty()
  @MinLength(3)
  password: string;

  @IsNotEmpty()
  @IsInt()
  role_id: number; 

  @IsOptional()
  @IsString()
  pfp?: string; 
}
