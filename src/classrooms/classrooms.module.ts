import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomStudent } from '../database/entities/classroom-student.entity.js';
import { Classroom } from '../database/entities/classroom.entity.js';
import { GradeLevel } from '../database/entities/grade-level.entity.js';
import { Student } from '../database/entities/student.entity.js';
import { Teacher } from '../database/entities/teacher.entity.js';
import { ClassroomsController } from './classrooms.controller.js';
import { ClassroomsService } from './classrooms.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Classroom,
      ClassroomStudent,
      Student,
      Teacher,
      GradeLevel,
    ]),
  ],
  controllers: [ClassroomsController],
  providers: [ClassroomsService],
})
export class ClassroomsModule {}
