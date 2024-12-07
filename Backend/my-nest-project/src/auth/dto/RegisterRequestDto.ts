import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsInt } from 'class-validator';

export class RegisterRequestDto {
    @IsNotEmpty()
    role: string;
    name : string;
    email: string;
    hash_pass: string;
    pfp?: string;
    createtime: Date;
}
