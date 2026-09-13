import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IngestionRun, IngestionStatus } from "./ingestion-run.entity.js";
import { Repository } from "typeorm";
import { firstValueFrom } from 'rxjs';
import { TemperatureReading } from "../readings/temperature-reading.entity.js";
import { SensorService } from "../sensors/sensors.service.js";
import { HttpService } from "@nestjs/axios";
import { SensorType } from "../sensors/sensor.entity.js";

type FormatA = { sensorCode: string, ts: string, valueC: number }[];
type FormatB = { deviceId: string, data: { time: number, temp: number }[] };

@Injectable()
export class IngestionService {
    constructor(
        @InjectRepository(IngestionRun)
        private readonly ingestionRunRepository: Repository<IngestionRun>,
        @InjectRepository(TemperatureReading)
        private readonly temperatureReadingRepository: Repository<TemperatureReading>,
        private readonly sensorService: SensorService,
        private readonly httpService: HttpService,
    ) { }

    findBySensor(id: string): Promise<IngestionRun[]> {
        return this.ingestionRunRepository.find({
            where: { sensor: { id } },
            order: { startedAt: 'DESC' },
        });
    }

    findAll(): Promise<IngestionRun[]> {
        return this.ingestionRunRepository.find({
            relations: { sensor: true },
            order: { startedAt: 'DESC' },
        });
    }

    async ingest(sensorId: string, payload: any): Promise<IngestionRun> {
        const sensor = await this.sensorService.getSensorById(sensorId);
        if (!sensor) throw new BadRequestException('El id del sensor no existe');

        const run = this.ingestionRunRepository.create({
            sensor,
            status: IngestionStatus.ERROR,
            recordsProcessed: 0
        });

        try {
            let resolvedPayload = payload;
            if (sensor.type === SensorType.HTTP_POLL) {
                if (!sensor.url) throw new BadRequestException('El sensor HTTP_POLL no tiene URL configurada');

                const { data } = await firstValueFrom(this.httpService.get(sensor.url));
                resolvedPayload = data;
            }

            const readings = this.parsePayload(sensorId, sensor.sensorCode, resolvedPayload);

            if (readings.length > 0) {
                const entities = readings.map(reading =>
                    this.temperatureReadingRepository.create({
                        sensor,
                        timestamp: reading.timestamp,
                        valueC: reading.valueC,
                    })
                );
                const saved = await this.temperatureReadingRepository.save(entities);
                run.recordsProcessed = saved.length;
            } else {
                run.recordsProcessed = 0;
            }

            run.status = IngestionStatus.SUCCESS;
            run.finishedAt = new Date();
        } catch (err) {
            run.status = IngestionStatus.ERROR;
            run.errorMessage = err instanceof Error ? err.message : String(err);
            run.finishedAt = new Date();
        }

        return this.ingestionRunRepository.save(run);
    }

    private parsePayload(sensorId: string, sensorCode: string, payload: any): { timestamp: Date, valueC: number }[] {
        if (Array.isArray(payload))
            return this.parseFormatA(sensorCode, payload as FormatA);
        else if (typeof payload === 'object' && payload !== null && 'deviceId' in payload)
            return this.parseFormatB(sensorCode, payload as FormatB);
        else
            throw new BadRequestException('No se reconoce el formato del payload')
    }

    private parseFormatA(sensorCode: string, ingestionData: FormatA): { timestamp: Date, valueC: number }[] {
        return ingestionData
            .filter((item) => {
                if (item.sensorCode !== sensorCode) return false;
                if (!item.ts || typeof item.valueC !== 'number') throw new BadRequestException('Formato A: faltan los valores para TS o ValueC');
                return true;
            })
            .map((item) => ({
                timestamp: new Date(item.ts),
                valueC: item.valueC
            }))
            ;
    }

    private parseFormatB(sensorCode: string, ingestionData: FormatB): { timestamp: Date, valueC: number }[] {
        if (ingestionData.deviceId !== sensorCode) return []
        if (!Array.isArray(ingestionData.data)) throw new BadRequestException('Formato B: faltan valores para time o temp');

        return ingestionData.data
            .map((item) => {
                if (typeof item.time !== 'number' || typeof item.temp !== 'number') throw new BadRequestException('Formato B: Los valores de time o temp no son correctos');
                return {
                    timestamp: new Date(item.time * 1000),
                    valueC: item.temp
                };
            }
            );
    }
}