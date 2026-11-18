import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Student } from '../database/entities/student.entity.js';
import { StudentsService } from './students.service.js';
import {
  createStudentSchema,
  studentSearchSchema,
  updateStudentSchema,
} from './student.schemas.js';

describe('StudentsService', () => {
  const queryBuilder = {
    andWhere: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    addOrderBy: vi.fn().mockReturnThis(),
    getMany: vi.fn(),
  };
  const repository = {
    createQueryBuilder: vi.fn(() => queryBuilder),
    findOneBy: vi.fn(),
    create: vi.fn((student) => student),
    save: vi.fn((student) => Promise.resolve(student)),
    softRemove: vi.fn(),
  };
  const service = new StudentsService(
    repository as unknown as Repository<Student>,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('applies all supported search filters and excludes soft-deleted rows by default', async () => {
    queryBuilder.getMany.mockResolvedValue([]);

    await service.findAll({
      studentCode: 'S-100',
      firstName: 'Ada',
      lastName: 'Lovelace',
      gradeLevelId: 2,
    });

    expect(repository.createQueryBuilder).toHaveBeenCalledWith('student');
    expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(
      1,
      'student.studentCode = :studentCode',
      { studentCode: 'S-100' },
    );
    expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(
      2,
      'student.firstName LIKE :firstName',
      { firstName: '%Ada%' },
    );
    expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(
      3,
      'student.lastName LIKE :lastName',
      { lastName: '%Lovelace%' },
    );
    expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(
      4,
      'student.gradeLevelId = :gradeLevelId',
      { gradeLevelId: 2 },
    );
    expect(queryBuilder.getMany).toHaveBeenCalled();
  });

  it('throws not found for missing or soft-deleted students', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(404)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('sets timestamps when creating a student', async () => {
    const input = {
      studentCode: 'S-100',
      prefixId: 1,
      firstName: 'Ada',
      lastName: 'Lovelace',
      genderId: 2,
      birthDate: '2015-12-10',
      gradeLevelId: 1,
    };

    await service.create(input);

    expect(repository.create).toHaveBeenCalledWith({
      ...input,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(repository.save).toHaveBeenCalled();
  });

  it('soft-deletes a found student', async () => {
    const student = { id: 5 } as Student;
    repository.findOneBy.mockResolvedValue(student);

    await service.remove(5);

    expect(repository.softRemove).toHaveBeenCalledWith(student);
  });

  it('validates create, partial-update, and search inputs', () => {
    expect(
      createStudentSchema.safeParse({
        studentCode: 'S-100',
        prefixId: 1,
        firstName: 'Ada',
        lastName: 'Lovelace',
        genderId: 2,
        birthDate: '2015-12-10',
        gradeLevelId: 1,
      }).success,
    ).toBe(true);
    expect(createStudentSchema.safeParse({ studentCode: '' }).success).toBe(false);
    expect(updateStudentSchema.safeParse({}).success).toBe(false);
    expect(studentSearchSchema.parse({ gradeLevelId: '2' })).toEqual({
      gradeLevelId: 2,
    });
  });
});
