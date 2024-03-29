import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as back4app from './config/back4app';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ApiHttpErrorFilter } from './global/filters/error.filter';

async function bootstrap() {
  back4app.config();

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new ApiHttpErrorFilter());

  const urls: string[] = process.env.CORS_ENABLED_URL.split('|');

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
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
