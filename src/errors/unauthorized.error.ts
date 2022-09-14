export class UnauthorizedError extends Error {
  name = 'UnauthorizedError';

  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
