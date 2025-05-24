import { 
  IsNotEmpty, 
  IsString, 
  IsNumber,
  IsOptional,
  IsDateString
} from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  givenById: number;

  @IsOptional()
  @IsDateString()
  createdAt?: Date; 
}