import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Address } from '../../address/entities/address.entity';
import { Store } from '../../store/entities/store.entity';

@Entity()
export class Customer{
  @PrimaryColumn({ name: 'customer_id' })
  customer_id: number;

  @Column({ type: 'varchar', length: 45, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 45, nullable: false })
  last_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  email: string;

  @Column({ type: 'boolean', default: true, name: 'activebool' })
  activebool: boolean;

  @Column({ type: 'date', default: () => 'CURRENT_DATE', name: 'create_date' })
  create_date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true, name: 'last_update' })
  last_update: Date;

  @Column({ type: 'int', nullable: true })
  active: number;  // Ce champ correspond à la colonne "active" de la base de données

  @ManyToOne(() => Store, { eager: true }) 
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => Address, { eager: true }) 
  @JoinColumn({ name: 'address_id' })
  address: Address;
}