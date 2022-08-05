import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
