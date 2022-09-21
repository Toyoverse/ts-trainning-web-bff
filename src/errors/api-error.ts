export type ApiErrorOptions = {
  cause?: string;
  ctx?: string;
};

export class ApiError extends Error {
  private _options?: ApiErrorOptions;

  constructor(message: string, options?: ApiErrorOptions) {
    super(message);
    this._options = options || {};
  }

  get cause() {
    return this._options.cause;
  }

  get ctx() {
    return this._options.ctx;
  }
}
