import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Post } from './post.entity';
import { Product } from './product.entity';

@Entity('sites')
export class Site {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  wp_url: string;

  @Column({ nullable: true })
  wp_user: string;

  @Column({ nullable: true })
  app_password: string;

  @Column({ nullable: true })
  wc_key: string;
  
  @Column({ nullable: true })
  wc_secret: string;
  
  @Column({ default: true })
  active: boolean;
  
  @Column({ default: false })
  has_woocommerce: boolean;

  @Column({ nullable: true })
  last_sync_date: Date;

  @OneToMany(() => Post, post => post.site)
  posts: Post[];

  @OneToMany(() => Product, product => product.site)
  products: Product[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
