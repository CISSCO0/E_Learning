import { IsString, IsNotEmpty } from 'class-validator';

export class pass {

  @IsNotEmpty()
  pass: boolean;
}
