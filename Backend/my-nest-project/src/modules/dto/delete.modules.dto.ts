import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteModuleDto {
  @IsString()
  @IsNotEmpty()
  moduleId: string; 
}
