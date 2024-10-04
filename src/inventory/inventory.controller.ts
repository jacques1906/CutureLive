import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll(): Promise<Inventory[]> {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Inventory> {
    return this.inventoryService.findOne(id);
  }

  @Post()
  create(@Body() inventoryData: Partial<Inventory>): Promise<Inventory> {
    return this.inventoryService.create(inventoryData);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() inventoryData: Partial<Inventory>): Promise<Inventory> {
    return this.inventoryService.update(id, inventoryData);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.inventoryService.delete(id);
  }
}
