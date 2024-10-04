import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('country')  // Associe cette entité à la table "country"
export class Country {
  @PrimaryGeneratedColumn({ name: 'country_id' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  country: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'last_update' })
  last_update: Date;

}
