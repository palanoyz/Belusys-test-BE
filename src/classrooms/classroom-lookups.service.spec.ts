import { Repository } from 'typeorm';
import { Teacher } from '../database/entities/teacher.entity.js';
import { ClassroomLookupsService } from './classroom-lookups.service.js';

describe('ClassroomLookupsService', () => {
  const queryBuilder = {
    leftJoin: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    addSelect: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    addOrderBy: vi.fn().mockReturnThis(),
    getRawMany: vi.fn(),
  };
  const teachersRepository = {
    createQueryBuilder: vi.fn(() => queryBuilder),
  };
  const service = new ClassroomLookupsService(
    teachersRepository as unknown as Repository<Teacher>,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns active teacher options with prefix names in display order', async () => {
    const teachers = [
      {
        id: 2,
        firstName: 'Teacher',
        lastName: 'Example',
        teacherCode: 'T002',
        prefix: 'ครู',
      },
    ];
    queryBuilder.getRawMany.mockResolvedValue(teachers);

    await expect(service.findAll()).resolves.toEqual(teachers);
    expect(teachersRepository.createQueryBuilder).toHaveBeenCalledWith(
      'teacher',
    );
    expect(queryBuilder.leftJoin).toHaveBeenCalledWith(
      'master_prefix',
      'prefix',
      'prefix.id = teacher.prefixId',
    );
    expect(queryBuilder.orderBy).toHaveBeenCalledWith(
      'teacher.lastName',
      'ASC',
    );
  });
});
