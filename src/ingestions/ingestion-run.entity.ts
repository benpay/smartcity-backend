import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn
} from 'typeorm';
import { Sensor } from '../sensors/sensor.entity.js';

export enum IngestionStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

@Entity('ingestion_runs')
export class IngestionRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Sensor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sensorId' })
  sensor: Sensor;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ nullable: true })
  finishedAt: Date;

  @Column({ type: 'enum', enum: IngestionStatus })
  status: IngestionStatus;

  @Column({ default: 0 })
  recordsProcessed: number;

  @Column({ nullable: true, type: 'text' })
  errorMessage: string;
}