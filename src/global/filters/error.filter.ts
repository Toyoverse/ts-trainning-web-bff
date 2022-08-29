import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConsoleLogger,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { Response } from 'express';
import {
  BadRequestError,
  ConstraintViolationError,
  NotFoundError,
} from 'src/errors';

const errorsHttpExceptions = new Map<string, ClassConstructor<any>>([
  [ConstraintViolationError.name, BadRequestException],
  [NotFoundError.name, NotFoundException],
  [BadRequestError.name, BadRequestException],
]);

@Catch(Error)
export class ApiHttpErrorFilter implements ExceptionFilter {
  logger = new Logger('ExceptionsHandler');

  catch(err: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (err instanceof HttpException) {
      response.status(err.getStatus()).json(err.getResponse());
      return;
    }

    if (!errorsHttpExceptions.has(err.name)) {
      response.status(500).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
      this.logger.error(err.message);
      throw err;
    }

    const HttpExceptionClass = errorsHttpExceptions.get(err.name);
    const httpException: HttpException = new HttpExceptionClass(err.message);

    response
      .status(httpException.getStatus())
      .json(httpException.getResponse());
  }
}