import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as back4app from './config/back4app';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  back4app.config();

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const urls: string[] = process.env.CORS_ENABLED_URL.split('|');

  app.enableCors({
    methods: ['GET', 'POST'],
    origin: urls,
  });
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Toyoverse Training Module BFF')
    .setDescription('The Toyoverse Training Module API description')
    .setVersion('0.0.1')
    .addTag('training module')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
