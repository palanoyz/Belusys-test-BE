import { z } from 'zod';

const studentFields = {
  studentCode: z.string().trim().min(1).max(20),
  prefixId: z.number().int().positive(),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  genderId: z.number().int().positive(),
  birthDate: z.iso.date(),
  gradeLevelId: z.number().int().positive(),
};

export const createStudentSchema = z.object(studentFields);

export const updateStudentSchema = z
  .object({
    studentCode: studentFields.studentCode.optional(),
    prefixId: studentFields.prefixId.optional(),
    firstName: studentFields.firstName.optional(),
    lastName: studentFields.lastName.optional(),
    genderId: studentFields.genderId.optional(),
    birthDate: studentFields.birthDate.optional(),
    gradeLevelId: studentFields.gradeLevelId.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });

export const studentSearchSchema = z.object({
  studentCode: z.string().trim().optional(),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  gradeLevelId: z.coerce.number().int().positive().optional(),
});

export const studentIdSchema = z.coerce.number().int().positive();
