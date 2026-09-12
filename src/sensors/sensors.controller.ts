import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { SensorService } from './sensors.service.js';
import { CreateSensorDto, UpdateSensorDto } from './dto/sensor.dto.js';

@Controller()
export class SensorController {
    constructor(private readonly sensorService: SensorService){}

    @Get('getSensorsAll')
    getAll(){
        return this.sensorService.getSensorsAll();
    }

    @Get('getSensorById/:id')
    getById(@Param('id') id: string){
        return this.sensorService.getSensorById(id);
    }

    @Post('createSensor')
    createSensor(@Body() dto: CreateSensorDto){
        return this.sensorService.create(dto);
    }

    @Patch('updateSensor/:id')
    updateSensor(@Param('id') id: string, @Body() dto: UpdateSensorDto){
        return this.sensorService.update(id, dto);
    }

    @Delete('deleteSensor/:id')
    deleteSensor(@Param('id') id: string) {
        return this.sensorService.delete(id);
    }
}