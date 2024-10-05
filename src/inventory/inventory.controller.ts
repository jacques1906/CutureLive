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

  @Get(':inventory_id')
  findOne(@Param('inventory_id') inventory_id: number): Promise<Inventory> {
    return this.inventoryService.findOne(inventory_id);
  }

  @Post()
  create(@Body() inventoryData: Partial<Inventory>): Promise<Inventory> {
    return this.inventoryService.create(inventoryData);
  }

  @Put(':inventory_id')
  update(@Param('inventory_id') inventory_id: number, @Body() inventoryData: Partial<Inventory>): Promise<Inventory> {
    return this.inventoryService.update(inventory_id, inventoryData);
  }

  @Delete(':inventory_id')
  delete(@Param('inventory_id') inventory_id: number): Promise<void> {
    return this.inventoryService.delete(inventory_id);
  }
}
