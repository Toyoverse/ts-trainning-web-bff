import { configure as serverlessExpress } from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cors from 'cors';

import * as back4app from './config/back4app';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ApiHttpErrorFilter } from './global/filters/error.filter';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  back4app.config();

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new ApiHttpErrorFilter());

  const options: cors.CorsOptions = {
    methods: 'GET,POST,OPTIONS,PUT',
    origin: '*',
  };

  app.use(cors(options));

  app.use(helmet());

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
