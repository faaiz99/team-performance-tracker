import { 
  IsNotEmpty, 
  IsString, 
  IsBoolean, 
  IsOptional,
  IsNumber 
} from 'class-validator';

export class CreateGoalDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean = false; // Defaults to false if not provided

  @IsNotEmpty()
  @IsNumber()
  userId: number; // The user who owns this goal
}