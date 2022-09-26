import { ApiError, ApiErrorOptions } from './api-error';

export class ConstraintViolationError extends ApiError {
  name = 'ConstraintViolationError';

  constructor(message?: string, options?: ApiErrorOptions) {
    super(message, options);

    Object.setPrototypeOf(this, ConstraintViolationError.prototype);
  }
}
