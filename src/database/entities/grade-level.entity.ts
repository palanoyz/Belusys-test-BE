import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'grade_levels' })
export class GradeLevel {
  @PrimaryGeneratedColumn({ type: 'tinyint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 10 })
  code: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 100, name: 'full_name' })
  fullName: string;

  @Column({ type: 'enum', enum: ['PRIMARY', 'SECONDARY'] })
  stage: 'PRIMARY' | 'SECONDARY';

  @Column({ type: 'tinyint', unsigned: true, name: 'sort_order' })
  sortOrder: number;
}
