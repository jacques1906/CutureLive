import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Film } from '../../film/entities/film.entity';
import { Store } from '../../store/entities/store.entity';

@Entity('inventory')  // Associe cette entité à la table "inventory"
export class Inventory {
  @PrimaryGeneratedColumn({ name: 'inventory_id' })
  id: number;

  @ManyToOne(() => Film)  // Relation avec la table Film
  @JoinColumn({ name: 'film_id' })
  film: Film;

  @ManyToOne(() => Store)  // Relation avec la table Store
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'last_update' })
  last_update: Date;
}
