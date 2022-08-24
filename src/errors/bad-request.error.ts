export class BadRequestError extends Error {
  name = 'BadRequestError';

  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
