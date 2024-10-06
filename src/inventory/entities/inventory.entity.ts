import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Film } from '../../film/entities/film.entity';
import { Store } from '../../store/entities/store.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  inventory_id: number;

  @ManyToOne(() => Film)
  @JoinColumn({ name: 'film_id' })
  film: Film;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_update: Date;
}