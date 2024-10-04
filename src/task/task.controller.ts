import { Controller, Get } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('run-j5')
  runReminderJ5() {
    return this.taskService.handleReminderJ5();
  }

  @Get('run-j3')
  runReminderJ3() {
    return this.taskService.handleReminderJ3();
  }

  @Get('list')
  listTasks() {
    return ['Reminder J-5', 'Reminder J-3'];
  }
}
