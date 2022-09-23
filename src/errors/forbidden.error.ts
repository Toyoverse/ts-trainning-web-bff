import { ApiError, ApiErrorOptions } from './api-error';

export class ForbiddenError extends ApiError {
  name = 'ForbiddenError';

  constructor(message?: string, options?: ApiErrorOptions) {
    super(message, options);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
