import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../database/entities/teacher.entity.js';

@Injectable()
export class ClassroomLookupsService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  async findAll() {
    const teachers = await this.teachersRepository
      .createQueryBuilder('teacher')
      .leftJoin('master_prefix', 'prefix', 'prefix.id = teacher.prefixId')
      .select('teacher.id', 'id')
      .addSelect('teacher.firstName', 'firstName')
      .addSelect('teacher.lastName', 'lastName')
      .addSelect('teacher.teacherCode', 'teacherCode')
      .addSelect('prefix.shortName', 'prefix')
      .orderBy('teacher.lastName', 'ASC')
      .addOrderBy('teacher.firstName', 'ASC')
      .getRawMany<{
        id: number;
        firstName: string;
        lastName: string;
        teacherCode: string;
        prefix: string | null;
      }>();

    return teachers;
  }
}
