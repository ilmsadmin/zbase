import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { ExcelItem } from './excel-item.entity';

@Entity('excel_uploads')
export class ExcelUpload {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  filename: string;

  @Column()
  originalname: string;

  @Column()
  mimetype: string;

  @Column()
  type: string; // 'posts' hoặc 'products'

  @Column({ default: 'pending' })
  status: string; // 'pending', 'processed', 'completed', 'error'

  @Column('simple-json', { nullable: true })
  error_log: { message: string; row?: number }[];

  @OneToMany(() => ExcelItem, item => item.upload)
  items: ExcelItem[];

  @CreateDateColumn()
  uploaded_at: Date;
}
