import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemperatureReading } from './temperature-reading.entity.js';

@Injectable()
export class ReadingsService {
  constructor(
    @InjectRepository(TemperatureReading)
    private readonly readingRepository: Repository<TemperatureReading>,
  ) {}

  // Al ponerlo en el param esto se puede actualizar mas facilmente
  
      findBySensor(sensorId: string, limit: number = 20): Promise<TemperatureReading[]> {
        return this.readingRepository
          .createQueryBuilder('reading')
          .leftJoinAndSelect('reading.sensor', 'sensor')
          .where('sensor.id = :sensorId', { sensorId })
          .orderBy('reading.timestamp', 'DESC')
          .take(limit)
          .getMany();
}
}