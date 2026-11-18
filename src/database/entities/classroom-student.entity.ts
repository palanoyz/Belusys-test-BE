import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'classroom_students' })
export class ClassroomStudent {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true, name: 'classroom_id' })
  classroomId: number;

  @Column({ type: 'int', unsigned: true, name: 'student_id' })
  studentId: number;

  @Column({ type: 'smallint', unsigned: true, name: 'academic_year' })
  academicYear: number;

  @Column({ type: 'datetime', name: 'added_at' })
  addedAt: Date;

  @DeleteDateColumn({ type: 'datetime', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
