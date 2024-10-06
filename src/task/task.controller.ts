import { Controller, Get, Post, Param, Body } from '@nestjs/common'; 
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('schedule/:rental_id')
  async scheduleTask(
    @Param('rental_id') rental_id: number, 
    @Body() createTaskDto: CreateTaskDto
  ): Promise<Task> {
    return this.taskService.scheduleTask(rental_id, createTaskDto.task_type);
  }
  
  @Get()
  async getAllTasks(): Promise<Task[]> {
    return this.taskService.findAllTasks();
  }

  @Get(':id')
  async getTaskById(@Param('id') id: number): Promise<Task> {
    return this.taskService.findTaskById(id);
  }
  @Get(':id/status')
  async checkTaskStatus(@Param('id') id: number): Promise<{ task_id: number, is_sent: boolean }> {
    return this.taskService.checkTaskStatus(id);
    }

    
@Post(':id/run')
async runTaskManually(@Param('id') id: number): Promise<Task> {
  return this.taskService.runTaskManually(id);
}
}
