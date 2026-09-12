import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from './sensor.entity.js';
import { SensorService } from './sensors.service.js';
import { SensorController } from './sensors.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor])],
  providers: [SensorService],
  controllers: [SensorController],
  exports: [SensorService],
})
export class SensorsModule {}