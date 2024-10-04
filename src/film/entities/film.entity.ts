import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Language } from '../../language/entities/language.entity'; 

@Entity('film')
export class Film {
  @PrimaryGeneratedColumn()
  film_id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer', nullable: true })
  release_year: number;  
  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' }) 
  language: Language;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'original_language_id' })  
  original_language: Language;

  @Column({ type: 'smallint', default: 3 })
  rental_duration: number;

  @Column({ type: 'numeric', precision: 4, scale: 2, default: 4.99 })
  rental_rate: number;

  @Column({ type: 'smallint', nullable: true })
  length: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 19.99 })
  replacement_cost: number;

  @Column({ type: 'varchar', length: 5, default: 'G' })
  rating: string; 

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_update: Date;

  @Column({ type: 'text', array: true, nullable: true })
  special_features: string[];

  @Column({ type: 'tsvector', nullable: false })
  fulltext: string;  
}