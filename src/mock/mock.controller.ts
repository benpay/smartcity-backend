import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator.js';

@Controller('mock')
export class MockController {
  
  @Public()
  @Get('temp-format-a')
  formatA() {
    return [
      {
        sensorCode: 'GAR-101',
        ts: new Date().toISOString(),
        valueC: parseFloat((18 + Math.random() * 10).toFixed(1)),
      },
      {
        sensorCode: 'GAR-101',
        ts: new Date().toISOString(),
        valueC: parseFloat((18 + Math.random() * 10).toFixed(1)),
      },
    ];
  }

  @Public()
  @Get('temp-format-b')
  formatB() {
    return {
      deviceId: 'GAR-101',
      data: [
        {
          time: Math.floor(Date.now() / 1000),
          temp: parseFloat((18 + Math.random() * 10).toFixed(1)),
        },
      ],
    };
  }
}