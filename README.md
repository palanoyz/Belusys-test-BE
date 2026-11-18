# Belusys-test-BE

NestJS + TypeORM backend for the Student Classroom Management System.

## Requirements

- Node.js 22.18.0 or newer
- npm 11 or newer
- Access to the provided MySQL database

## Setup

```powershell
npm install
Copy-Item .env.example .env
npm run start:dev
```

See `.env.example` for the required database variables.

## Commands

```powershell
npm run start:dev
npm run build
npm run lint
npm run test
npm run test:e2e
```

## Database

TypeORM uses `synchronize: false` so existing tables and data are preserved.

## Student API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/students` | List active students; optionally filter with `studentCode`, `firstName`, `lastName` and `gradeLevelId` |
| `GET` | `/students/:id` | Get one active student |
| `POST` | `/students` | Create a student |
| `PATCH` | `/students/:id` | Update supplied student fields |
| `DELETE` | `/students/:id` | Soft-delete a student |

Request bodies, route IDs, and search parameters are validated with Zod schemas.

`GET /student-lookups` returns active prefixes and genders plus grade levels for
the student editor. This endpoint is read-only.

## Classroom API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/classrooms` | List active classrooms; optionally filter with `roomNo`, `roomName`, and `homeroomTeacher` |
| `GET` | `/classrooms/:id` | Get one active classroom |
| `POST` | `/classrooms` | Create a classroom |
| `PATCH` | `/classrooms/:id` | Update supplied classroom fields |
| `DELETE` | `/classrooms/:id` | Soft-delete a classroom |
| `GET` | `/classrooms/:id/students` | List active students enrolled for the classroom's academic year |
| `POST` | `/classrooms/:id/students` | Enroll a student using `{ "studentId": 1 }` |
| `DELETE` | `/classrooms/:id/students/:studentId` | Soft-delete a student enrollment |

Enrollment records use the classroom's academic year. Duplicate enrollments
for an active classroom/student/year are rejected. Request input is validated
with Zod schemas.

`GET /classroom-lookups` returns active homeroom teacher options for the
classroom editor.

## SQL Report

Run Report.sql in the provided MySQL database to list active male students aged 10-12 with their classroom and academic year. Age is calculated from date of birth on the day the report runs. Multiple active classroom assignments appear as separate rows.
