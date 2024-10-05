import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { RentalModule } from '../rental/rental.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/address/entities/address.entity';
import { City } from 'src/city/entities/city.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Country } from 'src/country/entities/country.entity';
import { Rental } from 'src/rental/entities/rental.entity';
import { Task } from './entities/task.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Address, City, Country, Customer, Rental, Task]),
  ],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
