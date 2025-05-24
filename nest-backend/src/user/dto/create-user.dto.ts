import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['employee', 'manager', 'hr'], {
    message: 'Role must be either employee, manager, or hr',
  })
  role: string;
}
