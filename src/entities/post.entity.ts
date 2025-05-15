import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Site } from './site.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Site, site => site.posts)
  site: Site;

  @Column({ nullable: true })
  wp_post_id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column('text')
  content: string;

  @Column('text', { nullable: true })
  excerpt: string;

  @Column('simple-json', { nullable: true })
  meta: {
    meta_title?: string;
    meta_description?: string;
    featured_image?: string;
  };

  @Column('simple-array', { nullable: true })
  categories: string[];

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ default: 'draft' })
  status: string;

  @Column('int', { nullable: true, default: 0 })
  seo_score: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
