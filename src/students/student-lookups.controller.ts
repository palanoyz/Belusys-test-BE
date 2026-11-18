import { Controller, Get } from '@nestjs/common';
import { StudentLookupsService } from './student-lookups.service.js';

@Controller('student-lookups')
export class StudentLookupsController {
  constructor(private readonly studentLookupsService: StudentLookupsService) {}

  @Get()
  findAll() {
    return this.studentLookupsService.findAll();
  }
}
