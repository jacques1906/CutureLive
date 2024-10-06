import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from 'src/customer/entities/customer.entity';
import { Rental } from 'src/rental/entities/rental.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  task_id: number;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Rental)
  @JoinColumn({ name: 'rental_id' })
  rental: Rental;

  @Column({ type: 'timestamp' })
  send_date: Date;

  @Column({ type: 'varchar', length: 10 })
  task_type: string; 

  @Column({ type: 'boolean', default: false })
  is_sent: boolean;
}
