import { IsString, IsArray} from 'class-validator';

export class CreateThreadDto {
  @IsString()
   title: string;

  @IsArray()
  @IsString({ each: true })
   messages: string[]=[];

   //content: string;
}
