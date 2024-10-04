import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Address } from '../../address/entities/address.entity';
import { Store } from '../../store/entities/store.entity';

@Entity('staff')  // Indique que cette entité correspond à la table "staff"
export class Staff {
  @PrimaryGeneratedColumn({ name: 'staff_id' })
  id: number;

  @Column({ type: 'varchar', length: 45 })
  first_name: string;

  @Column({ type: 'varchar', length: 45 })
  last_name: string;

  @ManyToOne(() => Address)  // Relation avec Address
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column({ type: 'varchar', length: 50, nullable: true })
  email: string;

  @ManyToOne(() => Store)  // Relation avec Store
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'varchar', length: 16 })
  username: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'last_update' })
  last_update: Date;

  @Column({ type: 'bytea', nullable: true })
  picture: Buffer;  // Stockage des images sous forme de données binaires (bytea)
}
