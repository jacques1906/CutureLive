import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Task } from './entities/task.entity';
import { Rental } from 'src/rental/entities/rental.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Address } from 'src/address/entities/address.entity';
import { City } from 'src/city/entities/city.entity';
import { Country } from 'src/country/entities/country.entity';
import * as dayjs from 'dayjs';  
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async scheduleTask(rental_id: number, task_type: string): Promise<Task> {
    const rental = await this.rentalRepository.findOne({ 
      where: { rental_id },
      relations: ['customer'] 
    });

    if (!rental) {
      throw new NotFoundException(`Rental with ID ${rental_id} not found`);
    }

    const customer = rental.customer;

    const address = await this.addressRepository.findOne({
      where: { address_id: customer.customer_id },
      relations: ['city'],
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${customer.customer_id} not found`);
    }

    const city = await this.cityRepository.findOne({
      where: { city_id: address.city.city_id },
      relations: ['country'],
    });

    if (!city) {
      throw new NotFoundException(`City with ID ${address.city.city_id} not found`);
    }

    const returnDate = dayjs(rental.return_date);  
    console.log(`Return date (no timezone): ${returnDate.format()}`);

    let sendDate: dayjs.Dayjs;

    if (task_type === 'J-5') {
      sendDate = returnDate.subtract(5, 'day').set('hour', 12).set('minute', 0).set('second', 0);
    } else if (task_type === 'J-3') {
      sendDate = returnDate.subtract(3, 'day').set('hour', 12).set('minute', 0).set('second', 0);
    } else {
      throw new NotFoundException('Invalid task type');
    }

    const task = this.taskRepository.create({
      rental,
      customer,
      send_date: sendDate.toDate(),
      task_type,
      is_sent: false,
    });

    return this.taskRepository.save(task);
  }

  @Cron('* * * * *')  
  async checkForPendingTasks() {
    const now = new Date();
    const pendingTasks = await this.taskRepository.find({
      where: {
        is_sent: false, 
        send_date: LessThanOrEqual(now),  
      },
      relations: ['customer', 'rental'],
    });

    for (const task of pendingTasks) {
      console.log(`Sending email for task ${task.task_id} to customer ${task.customer.email}`);
      task.is_sent = true;
      await this.taskRepository.save(task);
    }
  }
  async findAllTasks(): Promise<Task[]> {
    return this.taskRepository.find({
      relations: ['customer', 'rental'], 
    });
  }

  async findTaskById(task_id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { task_id },
      relations: ['customer', 'rental'],
    });
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${task_id} not found`);
    }

    return task;
  }
  async runTaskManually(task_id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { task_id },
      relations: ['customer', 'rental'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${task_id} not found`);
    }

    if (task.is_sent) {
      throw new Error(`Task with ID ${task_id} has already been sent.`);
    }

    const now = new Date();
    if (now < task.send_date) {
      throw new Error(`Task with ID ${task_id} is scheduled for a future date: ${task.send_date}`);
    }

    console.log(`Sending email for task ${task.task_id} to customer ${task.customer.email}`);

    task.is_sent = true;
    return this.taskRepository.save(task);
  }
  
  async checkTaskStatus(task_id: number): Promise<{ task_id: number, is_sent: boolean }> {
    const task = await this.taskRepository.findOne({
      where: { task_id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${task_id} not found`);
    }

    return {
      task_id: task.task_id,
      is_sent: task.is_sent,
    };
  }
}
