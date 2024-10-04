import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateRentalDto {
  @IsNotEmpty()
  @IsInt()
  customer_id: number;

  @IsNotEmpty()
  @IsInt()
  film_id: number;

  @IsNotEmpty()
  @IsInt()
  staff_id: number;

  @IsNotEmpty()
  rental_date: Date;
}
