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

