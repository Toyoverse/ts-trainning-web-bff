export class NotFoundError extends Error {
  name = 'NotFoundError';

  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
