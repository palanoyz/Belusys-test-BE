import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../database/entities/student.entity.js';
import { GradeLevel } from '../database/entities/grade-level.entity.js';
import { MasterGender } from '../database/entities/master-gender.entity.js';
import { MasterPrefix } from '../database/entities/master-prefix.entity.js';
import { StudentLookupsController } from './student-lookups.controller.js';
import { StudentLookupsService } from './student-lookups.service.js';
import { StudentsController } from './students.controller.js';
import { StudentsService } from './students.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, GradeLevel, MasterGender, MasterPrefix]),
  ],
  controllers: [StudentsController, StudentLookupsController],
  providers: [StudentsService, StudentLookupsService],
})
export class StudentsModule {}
