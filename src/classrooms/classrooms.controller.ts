import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { z } from 'zod';
import { ClassroomStudent } from '../database/entities/classroom-student.entity.js';
import { Classroom } from '../database/entities/classroom.entity.js';
import {
  classroomIdSchema,
  classroomSearchSchema,
  createClassroomSchema,
  enrollStudentSchema,
  studentIdSchema,
  updateClassroomSchema,
} from './classroom.schemas.js';
import { ClassroomsService } from './classrooms.service.js';
import type { EnrolledStudent } from './classrooms.service.js';

type CreateClassroomInput = z.infer<typeof createClassroomSchema>;
type UpdateClassroomInput = z.infer<typeof updateClassroomSchema>;
type ClassroomSearch = z.infer<typeof classroomSearchSchema>;
type EnrollStudentInput = z.infer<typeof enrollStudentSchema>;

@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Get()
  findAll(
    @Query({ schema: classroomSearchSchema }) search: ClassroomSearch,
  ): Promise<Classroom[]> {
    return this.classroomsService.findAll(search);
  }

  @Get(':id/students')
  findStudents(
    @Param('id', { schema: classroomIdSchema }) id: number,
  ): Promise<EnrolledStudent[]> {
    return this.classroomsService.findStudents(id);
  }

  @Get(':id')
  findOne(
    @Param('id', { schema: classroomIdSchema }) id: number,
  ): Promise<Classroom> {
    return this.classroomsService.findOne(id);
  }

  @Post()
  create(
    @Body({ schema: createClassroomSchema }) input: CreateClassroomInput,
  ): Promise<Classroom> {
    return this.classroomsService.create(input);
  }

  @Post(':id/students')
  enrollStudent(
    @Param('id', { schema: classroomIdSchema }) id: number,
    @Body({ schema: enrollStudentSchema }) input: EnrollStudentInput,
  ): Promise<ClassroomStudent> {
    return this.classroomsService.enrollStudent(id, input.studentId);
  }

  @Patch(':id')
  update(
    @Param('id', { schema: classroomIdSchema }) id: number,
    @Body({ schema: updateClassroomSchema }) input: UpdateClassroomInput,
  ): Promise<Classroom> {
    return this.classroomsService.update(id, input);
  }

  @Delete(':id/students/:studentId')
  async removeStudent(
    @Param('id', { schema: classroomIdSchema }) id: number,
    @Param('studentId', { schema: studentIdSchema }) studentId: number,
  ): Promise<void> {
    await this.classroomsService.removeStudent(id, studentId);
  }

  @Delete(':id')
  async remove(
    @Param('id', { schema: classroomIdSchema }) id: number,
  ): Promise<void> {
    await this.classroomsService.remove(id);
  }
}
