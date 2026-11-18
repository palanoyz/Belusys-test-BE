import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ClassroomStudent } from './database/entities/classroom-student.entity.js';
import { Classroom } from './database/entities/classroom.entity.js';
import { GradeLevel } from './database/entities/grade-level.entity.js';
import { MasterGender } from './database/entities/master-gender.entity.js';
import { MasterPrefix } from './database/entities/master-prefix.entity.js';
import { Student } from './database/entities/student.entity.js';
import { Teacher } from './database/entities/teacher.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.getOrThrow<string>('DB_HOST'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'),
        entities: [
          Student,
          Teacher,
          Classroom,
          ClassroomStudent,
          GradeLevel,
          MasterGender,
          MasterPrefix,
        ],
        synchronize: false,
        migrationsRun: false,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
