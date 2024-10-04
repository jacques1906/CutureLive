import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { Staff } from '../../staff/entities/staff.entity';

@Entity('rental')  // Associe cette entité à la table "rental"
export class Rental {
  @PrimaryGeneratedColumn({ name: 'rental_id' })
  id: number;

  @Column({ type: 'timestamp', name: 'rental_date' })
  rental_date: Date;

  @ManyToOne(() => Inventory)  // Relation avec Inventory
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @ManyToOne(() => Customer)  // Relation avec Customer
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'timestamp', name: 'return_date', nullable: true })
  return_date: Date;

  @ManyToOne(() => Staff)  // Relation avec Staff
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'last_update' })
  last_update: Date;
}
