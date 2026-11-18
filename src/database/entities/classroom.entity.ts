import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'classrooms' })
export class Classroom {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 20, name: 'room_no' })
  roomNo: string;

  @Column({ type: 'varchar', length: 100, name: 'room_name' })
  roomName: string;

  @Column({ type: 'smallint', unsigned: true, name: 'academic_year' })
  academicYear: number;

  @Column({ type: 'tinyint', unsigned: true, name: 'grade_level_id' })
  gradeLevelId: number;

  @Column({ type: 'int', unsigned: true, name: 'homeroom_teacher_id' })
  homeroomTeacherId: number;

  @Column({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
