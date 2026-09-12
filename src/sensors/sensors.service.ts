import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Sensor, SensorType } from "./sensor.entity.js";
import { Repository } from "typeorm";
import { CreateSensorDto, UpdateSensorDto } from "./dto/sensor.dto.js";

@Injectable()
export class SensorService {
    constructor(
        @InjectRepository(Sensor)
        private readonly sensorsRepository: Repository<Sensor>
    ) {}

    async getSensorByCode(sensorCode: string): Promise<Sensor | null>{
        return await this.sensorsRepository.findOneBy({ sensorCode });
    }

    async getSensorById(id: string): Promise<Sensor | null>{ 
        return await this.sensorsRepository.findOneBy({ id });
    }

    async getSensorsAll(){
        return await this.sensorsRepository.find({ order: {createdAt: 'DESC' } });
    }

    async create (sensorCreateDto: CreateSensorDto): Promise<Sensor>{
        console.log(sensorCreateDto)
        if (!sensorCreateDto.sensorCode || !sensorCreateDto.name) throw new BadRequestException('El código de sensor o el nombre no pueden ser nulos');
        var sensorExists = await this.getSensorByCode(sensorCreateDto.sensorCode);
        if (sensorExists) throw new BadRequestException('Ya hay un sensor registrado con ese código');
        
        if (!sensorCreateDto.type || !sensorCreateDto.status) throw new BadRequestException('El tipo o el estado no pueden estar nulos');
        if (sensorCreateDto.type === SensorType.HTTP_POLL && !sensorCreateDto.url) throw new BadRequestException('La URL no puede ser nula con tipo HTTP_POLL');
        
        const sensorCreated = await this.sensorsRepository.create(sensorCreateDto);
        return await this.sensorsRepository.save(sensorCreated);
    }

    async update(id: string, sensorUpdatedto: UpdateSensorDto): Promise<Sensor> {
        var sensorToUpdate = await this.getSensorById(id);
        if (!sensorToUpdate) throw new BadRequestException('El id no coincide con ningún sensor');

        const newType = sensorUpdatedto.type ?? sensorToUpdate.type;
        const newUrl = sensorUpdatedto.url ?? sensorToUpdate.url;
        if (newType === SensorType.HTTP_POLL && !newUrl) { throw new BadRequestException('La url es obligatoria para sensores de tipo HTTP_POLL') }
        
        Object.assign(sensorToUpdate, sensorUpdatedto);
        return await this.sensorsRepository.save(sensorToUpdate);
    }

    async delete(id: string): Promise<void>{
        const sensorToDelete = await this.getSensorById(id);
        if (!sensorToDelete) throw new BadRequestException('El id no coincide con ningún sensor');
        await this.sensorsRepository.remove(sensorToDelete);
    }
}