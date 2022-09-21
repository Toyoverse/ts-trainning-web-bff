import { ApiError, ApiErrorOptions } from './api-error';

export class BadRequestError extends ApiError {
  name = 'BadRequestError';

  constructor(message?: string, options?: ApiErrorOptions) {
    super(message, options);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
