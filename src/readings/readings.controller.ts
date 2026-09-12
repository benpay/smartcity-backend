import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReadingsService } from './readings.service.js';

@Controller('readings')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Get(':id/readings')
  findBySensor(@Param('id') sensorId: string, @Query('limit') limit?: string, ) {
        console.log('sensorId recibido:', sensorId);
    return this.readingsService.findBySensor(sensorId, limit ? parseInt(limit) : 20);
  }
}