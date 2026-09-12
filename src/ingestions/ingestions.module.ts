import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionRun } from './ingestion-run.entity.js';
import { TemperatureReading } from '../readings/temperature-reading.entity.js';
import { IngestionService } from './ingestions.service.js';
import { IngestionController } from './ingestions.controller.js';
import { SensorsModule } from '../sensors/sensors.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([IngestionRun, TemperatureReading]),
    SensorsModule,
    HttpModule.register({ timeout: 5000 }),
  ],
  providers: [IngestionService],
  controllers: [IngestionController],
  exports: [IngestionService],
})
export class IngestionsModule {}