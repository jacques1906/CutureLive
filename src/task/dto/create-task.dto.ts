import { IsNotEmpty, IsString, IsBoolean, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsNumber()
  rental_id: number;

  @IsNotEmpty()
  @IsString()
  task_type: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  send_date: Date;

  @IsBoolean()
  is_sent: boolean = false;
}
