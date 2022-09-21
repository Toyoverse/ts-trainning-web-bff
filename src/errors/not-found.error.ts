import { ApiError, ApiErrorOptions } from './api-error';

export class NotFoundError extends ApiError {
  name = 'NotFoundError';

  constructor(message?: string, options?: ApiErrorOptions) {
    super(message, options);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
