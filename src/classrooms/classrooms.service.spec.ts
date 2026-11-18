import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClassroomStudent } from '../database/entities/classroom-student.entity.js';
import { Classroom } from '../database/entities/classroom.entity.js';
import { GradeLevel } from '../database/entities/grade-level.entity.js';
import { Student } from '../database/entities/student.entity.js';
import { Teacher } from '../database/entities/teacher.entity.js';
import {
  classroomSearchSchema,
  createClassroomSchema,
  enrollStudentSchema,
  updateClassroomSchema,
} from './classroom.schemas.js';
import { ClassroomsService } from './classrooms.service.js';

describe('ClassroomsService', () => {
  const queryBuilder = {
    leftJoin: vi.fn().mockReturnThis(),
    andWhere: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    addOrderBy: vi.fn().mockReturnThis(),
    getMany: vi.fn(),
    innerJoin: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    addSelect: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    getRawMany: vi.fn(),
  };
  const classroomsRepository = {
    createQueryBuilder: vi.fn(() => queryBuilder),
    findOneBy: vi.fn(),
    create: vi.fn((classroom) => classroom),
    save: vi.fn((classroom) => Promise.resolve(classroom)),
    softRemove: vi.fn(),
  };
  const classroomStudentsRepository = {
    createQueryBuilder: vi.fn(() => queryBuilder),
    findOneBy: vi.fn(),
    create: vi.fn((enrollment) => enrollment),
    save: vi.fn((enrollment) => Promise.resolve(enrollment)),
    softRemove: vi.fn(),
  };
  const studentsRepository = { findOneBy: vi.fn() };
  const teachersRepository = { findOneBy: vi.fn() };
  const gradeLevelsRepository = { findOneBy: vi.fn() };

  const service = new ClassroomsService(
    classroomsRepository as unknown as Repository<Classroom>,
    classroomStudentsRepository as unknown as Repository<ClassroomStudent>,
    studentsRepository as unknown as Repository<Student>,
    teachersRepository as unknown as Repository<Teacher>,
    gradeLevelsRepository as unknown as Repository<GradeLevel>,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('searches by room number, room name, and homeroom teacher', async () => {
    queryBuilder.getMany.mockResolvedValue([]);

    await service.findAll({
      roomNo: '2',
      roomName: 'Maple',
      homeroomTeacher: 'Ada',
    });

    expect(queryBuilder.leftJoin).toHaveBeenCalledWith(
      Teacher,
      'teacher',
      'teacher.id = classroom.homeroomTeacherId AND teacher.deletedAt IS NULL',
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledTimes(3);
    expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(
      3,
      '(teacher.firstName LIKE :homeroomTeacher OR teacher.lastName LIKE :homeroomTeacher)',
      { homeroomTeacher: '%Ada%' },
    );
  });

  it('enrolls an active student for the classroom academic year', async () => {
    const classroom = { id: 8, academicYear: 2569 } as Classroom;
    classroomsRepository.findOneBy.mockResolvedValue(classroom);
    studentsRepository.findOneBy.mockResolvedValue({ id: 4 });
    classroomStudentsRepository.findOneBy.mockResolvedValue(null);

    await service.enrollStudent(8, 4);

    expect(classroomStudentsRepository.findOneBy).toHaveBeenCalledWith({
      classroomId: 8,
      studentId: 4,
      academicYear: 2569,
    });
    expect(classroomStudentsRepository.create).toHaveBeenCalledWith({
      classroomId: 8,
      studentId: 4,
      academicYear: 2569,
      addedAt: expect.any(Date),
    });
    expect(classroomStudentsRepository.save).toHaveBeenCalled();
  });

  it('lists only non-deleted students enrolled for the classroom year', async () => {
    const students = [{ id: 4, studentCode: 'S-100' }];
    classroomsRepository.findOneBy.mockResolvedValue({
      id: 8,
      academicYear: 2569,
    });
    queryBuilder.getRawMany.mockResolvedValue(students);

    await expect(service.findStudents(8)).resolves.toBe(students);
    expect(classroomStudentsRepository.createQueryBuilder).toHaveBeenCalledWith(
      'enrollment',
    );
    expect(queryBuilder.innerJoin).toHaveBeenCalledWith(
      Student,
      'student',
      'student.id = enrollment.studentId AND student.deletedAt IS NULL',
    );
    expect(queryBuilder.where).toHaveBeenCalledWith(
      'enrollment.classroomId = :classroomId',
      { classroomId: 8 },
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      'enrollment.academicYear = :academicYear',
      { academicYear: 2569 },
    );
  });

  it('rejects duplicate enrollment', async () => {
    classroomsRepository.findOneBy.mockResolvedValue({
      id: 8,
      academicYear: 2569,
    });
    studentsRepository.findOneBy.mockResolvedValue({ id: 4 });
    classroomStudentsRepository.findOneBy.mockResolvedValue({
      id: 10,
      classroomId: 8,
      studentId: 4,
    });

    await expect(service.enrollStudent(8, 4)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(classroomStudentsRepository.save).not.toHaveBeenCalled();
  });

  it('soft-deletes the enrollment for the classroom academic year', async () => {
    const enrollment = { id: 10 } as ClassroomStudent;
    classroomsRepository.findOneBy.mockResolvedValue({
      id: 8,
      academicYear: 2569,
    });
    classroomStudentsRepository.findOneBy.mockResolvedValue(enrollment);

    await service.removeStudent(8, 4);

    expect(classroomStudentsRepository.findOneBy).toHaveBeenCalledWith({
      classroomId: 8,
      studentId: 4,
      academicYear: 2569,
    });
    expect(classroomStudentsRepository.softRemove).toHaveBeenCalledWith(
      enrollment,
    );
  });

  it('returns not found when removing a nonexistent enrollment', async () => {
    classroomsRepository.findOneBy.mockResolvedValue({
      id: 8,
      academicYear: 2569,
    });
    classroomStudentsRepository.findOneBy.mockResolvedValue(null);

    await expect(service.removeStudent(8, 4)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('validates classroom, update, and enrollment inputs', () => {
    expect(
      createClassroomSchema.safeParse({
        roomNo: '1',
        roomName: 'Maple',
        academicYear: 2569,
        gradeLevelId: 2,
        homeroomTeacherId: 7,
      }).success,
    ).toBe(true);
    expect(updateClassroomSchema.safeParse({}).success).toBe(false);
    expect(enrollStudentSchema.safeParse({ studentId: 0 }).success).toBe(false);
    expect(classroomSearchSchema.safeParse({ roomNo: '1' }).success).toBe(true);
  });
});
