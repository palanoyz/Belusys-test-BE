import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassroomStudent } from '../database/entities/classroom-student.entity.js';
import { Classroom } from '../database/entities/classroom.entity.js';
import { GradeLevel } from '../database/entities/grade-level.entity.js';
import { Student } from '../database/entities/student.entity.js';
import { Teacher } from '../database/entities/teacher.entity.js';
import type {
  classroomSearchSchema,
  createClassroomSchema,
  updateClassroomSchema,
} from './classroom.schemas.js';
import type { z } from 'zod';

type CreateClassroomInput = z.infer<typeof createClassroomSchema>;
type UpdateClassroomInput = z.infer<typeof updateClassroomSchema>;
type ClassroomSearch = z.infer<typeof classroomSearchSchema>;
export type EnrolledStudent = Pick<
  Student,
  | 'id'
  | 'studentCode'
  | 'prefixId'
  | 'firstName'
  | 'lastName'
  | 'genderId'
  | 'birthDate'
  | 'gradeLevelId'
>;

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectRepository(Classroom)
    private readonly classroomsRepository: Repository<Classroom>,
    @InjectRepository(ClassroomStudent)
    private readonly classroomStudentsRepository: Repository<ClassroomStudent>,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
    @InjectRepository(GradeLevel)
    private readonly gradeLevelsRepository: Repository<GradeLevel>,
  ) {}

  async findAll(search: ClassroomSearch): Promise<Classroom[]> {
    const query = this.classroomsRepository
      .createQueryBuilder('classroom')
      .leftJoin(
        Teacher,
        'teacher',
        'teacher.id = classroom.homeroomTeacherId AND teacher.deletedAt IS NULL',
      );

    if (search.roomNo) {
      query.andWhere('classroom.roomNo LIKE :roomNo', {
        roomNo: `%${search.roomNo}%`,
      });
    }

    if (search.roomName) {
      query.andWhere('classroom.roomName LIKE :roomName', {
        roomName: `%${search.roomName}%`,
      });
    }

    if (search.homeroomTeacher) {
      query.andWhere(
        '(teacher.firstName LIKE :homeroomTeacher OR teacher.lastName LIKE :homeroomTeacher)',
        { homeroomTeacher: `%${search.homeroomTeacher}%` },
      );
    }

    return query
      .orderBy('classroom.academicYear', 'DESC')
      .addOrderBy('classroom.roomNo', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<Classroom> {
    const classroom = await this.classroomsRepository.findOneBy({ id });
    if (!classroom) {
      throw new NotFoundException(`Classroom ${id} was not found`);
    }
    return classroom;
  }

  async create(input: CreateClassroomInput): Promise<Classroom> {
    await this.ensureReferences(input.gradeLevelId, input.homeroomTeacherId);
    const now = new Date();
    const classroom = this.classroomsRepository.create({
      ...input,
      createdAt: now,
      updatedAt: now,
    });
    return this.classroomsRepository.save(classroom);
  }

  async update(id: number, input: UpdateClassroomInput): Promise<Classroom> {
    const classroom = await this.findOne(id);
    const gradeLevelId = input.gradeLevelId ?? classroom.gradeLevelId;
    const homeroomTeacherId =
      input.homeroomTeacherId ?? classroom.homeroomTeacherId;
    await this.ensureReferences(gradeLevelId, homeroomTeacherId);
    Object.assign(classroom, input, { updatedAt: new Date() });
    return this.classroomsRepository.save(classroom);
  }

  async remove(id: number): Promise<void> {
    const classroom = await this.findOne(id);
    await this.classroomsRepository.softRemove(classroom);
  }

  async findStudents(id: number): Promise<EnrolledStudent[]> {
    const classroom = await this.findOne(id);
    return this.classroomStudentsRepository
      .createQueryBuilder('enrollment')
      .innerJoin(
        Student,
        'student',
        'student.id = enrollment.studentId AND student.deletedAt IS NULL',
      )
      .select('student.id', 'id')
      .addSelect('student.studentCode', 'studentCode')
      .addSelect('student.prefixId', 'prefixId')
      .addSelect('student.firstName', 'firstName')
      .addSelect('student.lastName', 'lastName')
      .addSelect('student.genderId', 'genderId')
      .addSelect('student.birthDate', 'birthDate')
      .addSelect('student.gradeLevelId', 'gradeLevelId')
      .where('enrollment.classroomId = :classroomId', { classroomId: id })
      .andWhere('enrollment.academicYear = :academicYear', {
        academicYear: classroom.academicYear,
      })
      .getRawMany<EnrolledStudent>();
  }

  async enrollStudent(
    classroomId: number,
    studentId: number,
  ): Promise<ClassroomStudent> {
    const classroom = await this.findOne(classroomId);
    const student = await this.studentsRepository.findOneBy({ id: studentId });
    if (!student) {
      throw new NotFoundException(`Student ${studentId} was not found`);
    }

    const existingEnrollment = await this.classroomStudentsRepository.findOneBy({
      classroomId,
      studentId,
      academicYear: classroom.academicYear,
    });
    if (existingEnrollment) {
      throw new BadRequestException(
        `Student ${studentId} is already enrolled in classroom ${classroomId} for academic year ${classroom.academicYear}`,
      );
    }

    return this.classroomStudentsRepository.save(
      this.classroomStudentsRepository.create({
        classroomId,
        studentId,
        academicYear: classroom.academicYear,
        addedAt: new Date(),
      }),
    );
  }

  async removeStudent(classroomId: number, studentId: number): Promise<void> {
    const classroom = await this.findOne(classroomId);
    const enrollment = await this.classroomStudentsRepository.findOneBy({
      classroomId,
      studentId,
      academicYear: classroom.academicYear,
    });
    if (!enrollment) {
      throw new NotFoundException(
        `Student ${studentId} is not enrolled in classroom ${classroomId} for academic year ${classroom.academicYear}`,
      );
    }
    await this.classroomStudentsRepository.softRemove(enrollment);
  }

  private async ensureReferences(
    gradeLevelId: number,
    homeroomTeacherId: number,
  ): Promise<void> {
    const [gradeLevel, teacher] = await Promise.all([
      this.gradeLevelsRepository.findOneBy({ id: gradeLevelId }),
      this.teachersRepository.findOneBy({ id: homeroomTeacherId }),
    ]);
    if (!gradeLevel) {
      throw new NotFoundException(`Grade level ${gradeLevelId} was not found`);
    }
    if (!teacher) {
      throw new NotFoundException(
        `Teacher ${homeroomTeacherId} was not found`,
      );
    }
  }
}
