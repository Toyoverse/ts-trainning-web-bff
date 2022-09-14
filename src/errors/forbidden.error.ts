export class ForbiddenError extends Error {
  name = 'ForbiddenError';

  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
