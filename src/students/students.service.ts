import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../database/entities/student.entity.js';
import type {
  createStudentSchema,
  studentSearchSchema,
  updateStudentSchema,
} from './student.schemas.js';
import type { z } from 'zod';

type CreateStudentInput = z.infer<typeof createStudentSchema>;
type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
type StudentSearch = z.infer<typeof studentSearchSchema>;

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  async findAll(search: StudentSearch): Promise<Student[]> {
    const query = this.studentsRepository.createQueryBuilder('student');

    if (search.studentCode) {
      query.andWhere('student.studentCode = :studentCode', {
        studentCode: search.studentCode,
      });
    }

    if (search.firstName) {
      query.andWhere('student.firstName LIKE :firstName', {
        firstName: `%${search.firstName}%`,
      });
    }

    if (search.lastName) {
      query.andWhere('student.lastName LIKE :lastName', {
        lastName: `%${search.lastName}%`,
      });
    }

    if (search.gradeLevelId) {
      query.andWhere('student.gradeLevelId = :gradeLevelId', {
        gradeLevelId: search.gradeLevelId,
      });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.studentsRepository.findOneBy({ id });
    if (!student) {
      throw new NotFoundException(`Student ${id} was not found`);
    }
    return student;
  }

  async create(input: CreateStudentInput): Promise<Student> {
    const now = new Date();
    const student = this.studentsRepository.create({
      ...input,
      createdAt: now,
      updatedAt: now,
    });
    return this.studentsRepository.save(student);
  }

  async update(id: number, input: UpdateStudentInput): Promise<Student> {
    const student = await this.findOne(id);
    Object.assign(student, input, { updatedAt: new Date() });
    return this.studentsRepository.save(student);
  }

  async remove(id: number): Promise<void> {
    const student = await this.findOne(id);
    await this.studentsRepository.softRemove(student);
  }
}
