import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Store } from '../../store/entities/store.entity';


@Entity('rental') 
export class Rental {
  @PrimaryGeneratedColumn({})
  rental_id: number;

  @Column({ type: 'timestamp'})
  rental_date: Date;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer; 

  @ManyToOne(() => Inventory)
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @Column({ type: 'timestamp', name: 'return_date', nullable: true })
  return_date: Date;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'last_update' })
  last_update: Date;

}
