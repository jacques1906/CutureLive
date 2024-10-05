import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { Rental } from './entities/rental.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { Film } from 'src/film/entities/film.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Store } from 'src/store/entities/store.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Task } from 'src/task/entities/task.entity';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rental,Staff,Inventory,Customer,Film,Task]),TaskModule,],
  providers: [RentalService],
  controllers: [RentalController],
  exports: [RentalService],
})
export class RentalModule {}
