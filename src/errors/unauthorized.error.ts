import { ApiError, ApiErrorOptions } from './api-error';

export class UnauthorizedError extends ApiError {
  name = 'UnauthorizedError';

  constructor(message?: string, options?: ApiErrorOptions) {
    super(message, options);

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
