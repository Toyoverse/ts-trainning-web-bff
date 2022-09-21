import { ApiError, ApiErrorOptions } from './api-error';

export class InternalServerError extends ApiError {
  name = 'InternalServerError';

  constructor(message?: string, options?: ApiErrorOptions) {
    super(message, options);

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
