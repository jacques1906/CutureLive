import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Task } from './entities/task.entity';
import { Rental } from 'src/rental/entities/rental.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Address } from 'src/address/entities/address.entity';
import { City } from 'src/city/entities/city.entity';
import * as cityTimezones from 'city-timezones';
import { Cron } from '@nestjs/schedule';
import { DateTime } from 'luxon';


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
  ) {}


  async scheduleTask(rental_id: number, task_type: string): Promise<Task> {
      const rental = await this.rentalRepository.findOne({
          where: { rental_id },
          relations: ['customer'],
      });
  
      if (!rental) {
          throw new NotFoundException(`Rental with ID ${rental_id} not found`);
      }
  
      const customer = rental.customer;
  
      const address = await this.addressRepository.findOne({
          where: { address_id: customer.address.address_id },
          relations: ['city'],
      });
  
      if (!address) {
          throw new NotFoundException(`Address with ID ${customer.address.address_id} not found`);
      }
  
      const city = address.city.name;
      const country = address.city.country.country;
  
      console.log(`City: ${city}, Country: ${country}`);
  
  
      const cityTimezoneData = cityTimezones.lookupViaCity(city);
      
      if (!cityTimezoneData || cityTimezoneData.length === 0) {
          throw new NotFoundException(`Timezone for city ${city} in country ${country} not found`);
      }
  
      const clientTimezone = cityTimezoneData[0].timezone;
      console.log(`Timezone for ${city}, ${country}: ${clientTimezone}`);
  

      const returnDate = DateTime.fromJSDate(new Date(rental.return_date)).setZone(clientTimezone).startOf('day');
  
      console.log("Client return date (only date part, ignoring time):", returnDate.toISO());
  
      let sendDate;
      if (task_type === 'J-5') {
          sendDate = returnDate.minus({ days: 5 });
      } else if (task_type === 'J-3') {
          sendDate = returnDate.minus({ days: 3 });
      } else {
          throw new NotFoundException('Invalid task type');
      }
  
      console.log("Calculated send date (before timezone adjustment):", sendDate.toISO());
  
      const sendDateAtNoon = sendDate.set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
  
      console.log("Client send date fixed to 12h00 in local timezone:", sendDateAtNoon.toISO());
  
      const finalSendDate = sendDateAtNoon.toUTC();
  
      console.log("Final send date in UTC:", finalSendDate.toISO());
  
      const task = this.taskRepository.create({
          rental,
          customer,
          send_date: finalSendDate.toJSDate(), 
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
    console.log(`Task with ID ${task.task_id} is scheduled for: ${task.send_date}`);
    console.log(`Sending email for task ${task.task_id} to customer ${task.customer.email}`);

    task.is_sent = true;

    return this.taskRepository.save(task);
}

async checkTaskStatus(task_id: number): Promise<{ status: string, task: Task }> {
  const task = await this.taskRepository.findOne({
      where: { task_id },
      relations: ['customer', 'rental'],
  });

  if (!task) {
      throw new NotFoundException(`Task with ID ${task_id} not found`);
  }

  if (task.is_sent) {
      return {
          status: `The task with ID ${task_id} has already been executed.`,
          task: task
      };
  } else {
      return {
          status: `The task with ID ${task_id} is scheduled for: ${task.send_date} and has not been sent yet.`,
          task: task
      };
  }
}

}
