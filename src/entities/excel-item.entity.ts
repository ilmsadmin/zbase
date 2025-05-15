import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ExcelUpload } from './excel-upload.entity';

@Entity('excel_items')
export class ExcelItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExcelUpload, upload => upload.items)
  upload: ExcelUpload;

  @Column('int')
  row_number: number;

  @Column('jsonb')
  data: Record<string, any>;

  @Column({ default: true })
  valid: boolean;

  @Column('simple-array', { nullable: true })
  error_messages: string[];

  @Column({ default: false })
  ready_to_post: boolean;

  @Column('int', { nullable: true })
  created_item_id: number;
  
  @Column({ nullable: true })
  created_item_type: string;  // 'post' hoặc 'product'
}
