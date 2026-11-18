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
import {
  createStudentSchema,
  studentIdSchema,
  studentSearchSchema,
  updateStudentSchema,
} from './student.schemas.js';
import { StudentsService } from './students.service.js';
import { Student } from '../database/entities/student.entity.js';

type CreateStudentInput = z.infer<typeof createStudentSchema>;
type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
type StudentSearch = z.infer<typeof studentSearchSchema>;

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll(
    @Query({ schema: studentSearchSchema }) search: StudentSearch,
  ): Promise<Student[]> {
    return this.studentsService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id', { schema: studentIdSchema }) id: number): Promise<Student> {
    return this.studentsService.findOne(id);
  }

  @Post()
  create(
    @Body({ schema: createStudentSchema }) input: CreateStudentInput,
  ): Promise<Student> {
    return this.studentsService.create(input);
  }

  @Patch(':id')
  update(
    @Param('id', { schema: studentIdSchema }) id: number,
    @Body({ schema: updateStudentSchema }) input: UpdateStudentInput,
  ): Promise<Student> {
    return this.studentsService.update(id, input);
  }

  @Delete(':id')
  async remove(@Param('id', { schema: studentIdSchema }) id: number): Promise<void> {
    await this.studentsService.remove(id);
  }
}
