import {
  IsString, MinLength, IsEnum, IsOptional, IsUrl
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { SensorStatus, SensorType } from '../sensor.entity.js';

export class CreateSensorDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  sensorCode: string;

  @IsEnum(SensorType)
  type: SensorType;

  @IsOptional()
  @IsEnum(SensorStatus)
  status?: SensorStatus;

  @IsOptional()
  @IsUrl({ require_tld: false }) // para permitir localhost, sino da error 
  url?: string;
}

export class UpdateSensorDto extends PartialType(CreateSensorDto) {}