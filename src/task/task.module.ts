import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { RentalModule } from '../rental/rental.module';

@Module({
  imports: [RentalModule],  // Importer RentalModule pour accéder aux locations
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
