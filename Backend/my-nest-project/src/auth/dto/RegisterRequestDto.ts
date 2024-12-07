import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsInt } from 'class-validator';

export class RegisterRequestDto {
    @IsNotEmpty()
    roleId: string;
    // name : string;
    // email: string;
    // hash_pass: string;
    // role_id: string;
    // pfp: string;
    // createtime: Date;
}
