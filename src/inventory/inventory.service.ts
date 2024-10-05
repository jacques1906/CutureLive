import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  findAll(): Promise<Inventory[]> {
    return this.inventoryRepository.find({ relations: ['film', 'store'] });
  }

  findOne(inventory_id: number): Promise<Inventory> {
    return this.inventoryRepository.findOne({ where: { inventory_id }, relations: ['film', 'store'] });
  }

  create(inventoryData: Partial<Inventory>): Promise<Inventory> {
    const inventory = this.inventoryRepository.create(inventoryData);
    return this.inventoryRepository.save(inventory);
  }

  update(inventory_id: number, inventoryData: Partial<Inventory>): Promise<Inventory> {
    return this.inventoryRepository.save({ inventory_id, ...inventoryData });
  }

  delete(inventory_id: number): Promise<void> {
    return this.inventoryRepository.delete(inventory_id).then(() => undefined);
  }

  async findInventoryById(inventory_id: number): Promise<Inventory> {
    return this.inventoryRepository.findOne({
      where: { inventory_id },
      relations: ['film', 'store'],
    });
  }
}
