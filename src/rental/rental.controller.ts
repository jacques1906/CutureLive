import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { RentalService } from './rental.service';
import { Rental } from './entities/rental.entity';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get()
  findAll(): Promise<Rental[]> {
    return this.rentalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Rental> {
    return this.rentalService.findOne(id);
  }

  @Post()
  async createRental(@Body() createRentalDto: CreateRentalDto): Promise<Rental> {
    return this.rentalService.createRental(createRentalDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() rentalData: Partial<Rental>): Promise<Rental> {
    return this.rentalService.update(id, rentalData);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.rentalService.delete(id);
  }
}
