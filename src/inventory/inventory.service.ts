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

  findOne(id: number): Promise<Inventory> {
    return this.inventoryRepository.findOne({ where: { id }, relations: ['film', 'store'] });
  }

  create(inventoryData: Partial<Inventory>): Promise<Inventory> {
    const inventory = this.inventoryRepository.create(inventoryData);
    return this.inventoryRepository.save(inventory);
  }

  update(id: number, inventoryData: Partial<Inventory>): Promise<Inventory> {
    return this.inventoryRepository.save({ id, ...inventoryData });
  }

  delete(id: number): Promise<void> {
    return this.inventoryRepository.delete(id).then(() => undefined);
  }
}
