import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn
} from 'typeorm';

export enum SensorType {
  HTTP_POLL = 'HTTP_POLL',
  MANUAL_UPLOAD = 'MANUAL_UPLOAD',
}

export enum SensorStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
}

@Entity('sensors')
export class Sensor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 50 })
  sensorCode: string;

  @Column({ type: 'enum', enum: SensorType })
  type: SensorType;

  @Column({ type: 'enum', enum: SensorStatus, default: SensorStatus.ACTIVE })
  status: SensorStatus;

  @Column({ nullable: true })
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}