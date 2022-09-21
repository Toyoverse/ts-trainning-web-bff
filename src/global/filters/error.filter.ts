import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { Response } from 'express';
import {
  BadRequestError,
  ConstraintViolationError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
  InternalServerError,
} from 'src/errors';

const errorsHttpExceptions = new Map<string, ClassConstructor<any>>([
  [ConstraintViolationError.name, BadRequestException],
  [NotFoundError.name, NotFoundException],
  [BadRequestError.name, BadRequestException],
  [ForbiddenError.name, ForbiddenException],
  [UnauthorizedError.name, UnauthorizedException],
  [InternalServerError.name, InternalServerErrorException],
  [Error.name, InternalServerErrorException],
]);

@Catch(Error)
export class ApiHttpErrorFilter implements ExceptionFilter {
  logger = new Logger();

  catch(err: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (err instanceof HttpException) {
      response.status(err.getStatus()).json(err.getResponse());
      return;
    }

    const HttpExceptionClass = errorsHttpExceptions.get(err.name);
    const httpException: HttpException = new HttpExceptionClass(err.message);

    response
      .status(httpException.getStatus())
      .json(httpException.getResponse());

    this._logInternalServerErrors(err);
  }

  private _logInternalServerErrors(err: Error) {
    if (process.env.NODE_ENV !== 'test') {
      if (err instanceof InternalServerError) {
        const ctx = err.ctx || 'ExceptionsHandler';
        this.logger.error(
          `${err.message}. Cause: ${err.cause}`,
          err.stack,
          ctx,
        );
      } else if (
        err instanceof InternalServerErrorException ||
        err instanceof Error
      ) {
        this.logger.error(err.message, err.stack);
      }
    }
  }
}
