import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IngestionService } from './ingestions.service.js';

@Controller('ingestion')
export class IngestionController {
    constructor(private readonly ingestionService: IngestionService){}
    
    @Post(':id/ingest')
    ingest(@Param('id') id: string, @Body() payload: any) {
        return this.ingestionService.ingest(id, payload)
    }

    @Get(':id/ingestions')
    findBySensor(@Param('id') id: string){
        return this.ingestionService.findBySensor(id);
    }

    @Get()
    findAll() {
       return this.ingestionService.findAll();
    }
}