import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'master_prefix' })
export class MasterPrefix {
  @PrimaryGeneratedColumn({ type: 'tinyint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 20, name: 'short_name' })
  shortName: string;

  @Column({ type: 'tinyint', unsigned: true, name: 'gender_id' })
  genderId: number;

  @Column({ type: 'tinyint', unsigned: true, name: 'sort_order' })
  sortOrder: number;

  @Column({ type: 'tinyint', name: 'is_active' })
  isActive: number;
}
