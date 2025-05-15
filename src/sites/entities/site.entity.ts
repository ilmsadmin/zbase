import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Post } from '../../entities/post.entity';

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

  @OneToMany(() => Post, (post: Post) => post.site)
  posts: Post[];

  @Column({ type: 'timestamp', nullable: true, name: 'last_sync_date' })
  lastSyncDate: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}