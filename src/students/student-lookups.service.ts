import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GradeLevel } from '../database/entities/grade-level.entity.js';
import { MasterGender } from '../database/entities/master-gender.entity.js';
import { MasterPrefix } from '../database/entities/master-prefix.entity.js';

@Injectable()
export class StudentLookupsService {
  constructor(
    @InjectRepository(MasterPrefix)
    private readonly prefixesRepository: Repository<MasterPrefix>,
    @InjectRepository(MasterGender)
    private readonly gendersRepository: Repository<MasterGender>,
    @InjectRepository(GradeLevel)
    private readonly gradesRepository: Repository<GradeLevel>,
  ) {}

  async findAll() {
    const [prefixes, genders, gradeLevels] = await Promise.all([
      this.prefixesRepository.find({
        where: { isActive: 1 },
        order: { sortOrder: 'ASC' },
      }),
      this.gendersRepository.find({
        where: { isActive: 1 },
        order: { sortOrder: 'ASC' },
      }),
      this.gradesRepository.find({ order: { sortOrder: 'ASC' } }),
    ]);

    return {
      prefixes,
      genders,
      gradeLevels,
    };
  }
}
