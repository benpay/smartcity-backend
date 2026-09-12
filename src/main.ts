import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Seguridad
  app.use(helmet());
  app.use(cookieParser());

  // CORS con credentials para que las cookies funcionen desde el frontend
  app.enableCors({
    origin: config.get('FRONTEND_URL', 'http://localhost:5173'),
    credentials: true,
  });

  // Prefijo global de API
  app.setGlobalPrefix('api');

  // Validamos y convertimos datos que entren desde el controlador
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // eliminamos los campos no declarados del DTO
      forbidNonWhitelisted: true,
      transform: true,        // conviertimos los tipos automáticamente
    }),
  );

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}/api`);
}

bootstrap();