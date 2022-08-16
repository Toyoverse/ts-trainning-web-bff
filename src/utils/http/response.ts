export class HttpResponse {
  statusCode: number;
  message?: string;
  body?: any;

  constructor(attrs?: { statusCode: number; message?: string; body?: any }) {
    if (attrs) {
      this.statusCode = attrs.statusCode;
      this.message = attrs.message;
      this.body = attrs.body;
    }
  }
}
