import { z } from 'zod';

const classroomFields = {
  roomNo: z.string().trim().min(1).max(20),
  roomName: z.string().trim().min(1).max(100),
  academicYear: z.number().int().positive().max(9999),
  gradeLevelId: z.number().int().positive(),
  homeroomTeacherId: z.number().int().positive(),
};

export const createClassroomSchema = z.object(classroomFields);

export const updateClassroomSchema = z
  .object({
    roomNo: classroomFields.roomNo.optional(),
    roomName: classroomFields.roomName.optional(),
    academicYear: classroomFields.academicYear.optional(),
    gradeLevelId: classroomFields.gradeLevelId.optional(),
    homeroomTeacherId: classroomFields.homeroomTeacherId.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });

export const classroomSearchSchema = z.object({
  roomNo: z.string().trim().optional(),
  roomName: z.string().trim().optional(),
  homeroomTeacher: z.string().trim().optional(),
});

export const classroomIdSchema = z.coerce.number().int().positive();
export const studentIdSchema = z.coerce.number().int().positive();

export const enrollStudentSchema = z.object({
  studentId: studentIdSchema,
});
