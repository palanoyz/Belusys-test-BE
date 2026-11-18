import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'master_gender' })
export class MasterGender {
  @PrimaryGeneratedColumn({ type: 'tinyint', unsigned: true })
  id: number;

  @Column({ type: 'char', length: 1 })
  code: string;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'varchar', length: 20, name: 'name_en' })
  nameEn: string;

  @Column({ type: 'tinyint', unsigned: true, name: 'sort_order' })
  sortOrder: number;

  @Column({ type: 'tinyint', name: 'is_active' })
  isActive: number;
}
