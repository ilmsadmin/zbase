import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Site } from './site.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Site, site => site.products)
  site: Site;

  @Column({ nullable: true })
  wc_product_id: number;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  short_description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  regular_price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  sale_price: number;

  @Column('int', { default: 0 })
  stock: number;

  @Column({ default: 'instock' })
  stock_status: string;

  @Column('simple-json', { nullable: true })
  images: { src: string; name: string; alt: string }[];

  @Column('simple-array', { nullable: true })
  categories: string[];

  @Column('simple-json', { nullable: true })
  attributes: { name: string; options: string[]; visible: boolean }[];

  @Column({ default: 'simple' })
  type: string;
  
  @Column({ default: false })
  featured: boolean;
  
  @Column({ default: 'pending' })
  wc_sync_status: string;
  
  @Column({ type: 'text', nullable: true })
  wc_error: string;
  
  @Column({ nullable: true })
  wc_last_sync_attempt: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  synced_at: Date;
}
