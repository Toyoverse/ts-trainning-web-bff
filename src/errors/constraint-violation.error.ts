export class ConstraintViolationError extends Error {
  name = 'ConstraintViolationError';

  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, ConstraintViolationError.prototype);
  }
}
