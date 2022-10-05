import { ApiError, ApiErrorOptions } from './api-error';

export class BadGatewayError extends ApiError {
  name = 'BadGatewayError';

  constructor(message?: string, options?: ApiErrorOptions) {
    super(message, options);

    Object.setPrototypeOf(this, BadGatewayError.prototype);
  }
}
