import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { Customer } from 'src/customer/entities/customer.entity'; 
import { Film } from 'src/film/entities/film.entity'; 
import { Staff } from 'src/staff/entities/staff.entity'; 

@Injectable()
export class RentalService {
  update(id: number, rentalData: Partial<Rental>): Promise<Rental> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<Rental[]> {
    throw new Error('Method not implemented.');
  }
  findOne(id: number): Promise<Rental> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,

    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  async createRental(createRentalDto: CreateRentalDto): Promise<Rental> {
    const { customer_id, film_id, staff_id, rental_date } = createRentalDto;

    // Vérifie que le client existe
    const customer = await this.customerRepository.findOne(customer_id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customer_id} not found`);
    }

    // Vérifie que le film existe
    const film = await this.filmRepository.findOne(film_id);
    if (!film) {
      throw new NotFoundException(`Film with ID ${film_id} not found`);
    }

    // Vérifie que le staff existe
    const staff = await this.staffRepository.findOne(staff_id);
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${staff_id} not found`);
    }

    // Créer la location
    const rental = this.rentalRepository.create({
      customer,
      film,
      staff,
      rental_date,
    });

    return this.rentalRepository.save(rental);
  }
}

