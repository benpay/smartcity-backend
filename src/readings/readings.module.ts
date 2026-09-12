import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemperatureReading } from './temperature-reading.entity.js';
import { ReadingsService } from './readings.service.js';
import { ReadingsController } from './readings.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([TemperatureReading])],
  providers: [ReadingsService],
  controllers: [ReadingsController],
  exports: [ReadingsService],
})
export class ReadingsModule {}