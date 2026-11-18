import { Controller, Get } from '@nestjs/common';
import { ClassroomLookupsService } from './classroom-lookups.service.js';

@Controller('classroom-lookups')
export class ClassroomLookupsController {
  constructor(
    private readonly classroomLookupsService: ClassroomLookupsService,
  ) {}

  @Get()
  findAll() {
    return this.classroomLookupsService.findAll();
  }
}
