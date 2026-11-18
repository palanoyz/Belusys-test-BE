import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'students' })
export class Student {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 20, name: 'student_code' })
  studentCode: string;

  @Column({ type: 'tinyint', unsigned: true, name: 'prefix_id' })
  prefixId: number;

  @Column({ type: 'varchar', length: 100, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 100, name: 'last_name' })
  lastName: string;

  @Column({ type: 'tinyint', unsigned: true, name: 'gender_id' })
  genderId: number;

  @Column({ type: 'date', name: 'birth_date' })
  birthDate: string;

  @Column({ type: 'tinyint', unsigned: true, name: 'grade_level_id' })
  gradeLevelId: number;

  @Column({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
