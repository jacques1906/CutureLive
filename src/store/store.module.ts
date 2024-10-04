import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],  // Assure-toi que l'entité Store est bien importée ici
  providers: [StoreService],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
