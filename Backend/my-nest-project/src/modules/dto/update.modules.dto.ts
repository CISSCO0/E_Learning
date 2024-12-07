import { IsBoolean, IsOptional ,IsString,IsNotEmpty,IsNumber} from 'class-validator';

export class UpdateModuleDto {

  @IsString()
  @IsNotEmpty()
  moduleId :string ;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content: string;

}
