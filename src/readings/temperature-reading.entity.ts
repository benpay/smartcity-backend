import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, Unique
} from 'typeorm';
import { Sensor } from '../sensors/sensor.entity.js';

@Entity('temperature_readings')
// control para duplicados
@Unique(['sensor', 'timestamp'])
export class TemperatureReading {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Sensor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sensorId' })
  sensor: Sensor;

  @Column()
  timestamp: Date;

  @Column('float')
  valueC: number;
}