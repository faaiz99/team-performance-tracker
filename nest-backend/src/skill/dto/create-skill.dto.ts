import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateSkillDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  level?: number; 

  @IsNotEmpty()
  @IsNumber()
  userId: number; 
}