import { IsNotEmpty, IsInt, IsDate } from 'class-validator';

export class CreateRentalDto {
  @IsNotEmpty()
  @IsInt()
  customer_id: number;

  @IsNotEmpty()
  @IsInt()
  inventory_id: number;

  @IsNotEmpty()
  @IsInt()
  staff_id: number;

  @IsNotEmpty()
  @IsDate()
  rental_date: Date;

  @IsNotEmpty()
  @IsDate()
  return_date: Date;

  task_type: string;
}
