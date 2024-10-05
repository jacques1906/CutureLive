import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { Customer } from 'src/customer/entities/customer.entity'; 
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Staff } from 'src/staff/entities/staff.entity'; 
import * as dayjs from 'dayjs'; 
import { TaskService } from 'src/task/task.service';
import { Task } from 'src/task/entities/task.entity';

@Injectable()
export class RentalService {
  async findAllrental(): Promise<Rental[]> {
    return this.rentalRepository.find()
  }

  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,

    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,

    private readonly taskService: TaskService, 
  ) {}

  async createRental(rentalData: CreateRentalDto): Promise<Rental> {
  

    const rental_date = dayjs(rentalData.rental_date);
    const returnDate = dayjs(rentalData.return_date);
    const rentalDuration = returnDate.diff(rental_date, 'day');

    if (rentalDuration < 7 || rentalDuration > 21) {
    throw new BadRequestException('The rental period must be between 7 and 21 days');
    }
    
    const customer = await this.customerRepository.findOne({
      where: { customer_id: rentalData.customer_id, activebool: true},
      select: ['customer_id'], 
    });
  
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${rentalData.customer_id} not found`);
    }


    const inventory = await this.inventoryRepository.findOne({
      where: { inventory_id: rentalData.inventory_id },
      relations: ['film'], 
    });
    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${rentalData.inventory_id} not found`);
    }

  
    const staff = await this.staffRepository.findOne({
      where: { staff_id: rentalData.staff_id },
    });
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${rentalData.staff_id} not found`);
    }


    const formattedStartDate = rental_date.format('YYYY-MM-DD HH:mm:ss');
    const formattedReturnDate = returnDate.format('YYYY-MM-DD HH:mm:ss');

    const rental = this.rentalRepository.create({
      rental_date: rentalData.rental_date,
      return_date: rentalData.return_date,
      inventory,
      customer,
      staff,
      
    });
    const savedRental = await this.rentalRepository.save(rental);
    await this.taskService.scheduleTask(savedRental.rental_id, 'J-5');
    await this.taskService.scheduleTask(savedRental.rental_id, 'J-3');

    return savedRental;
  }
}
