import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  error: string | string[];

  constructor(attrs?: {
    statusCode: number;
    message: string;
    error: string | string[];
  }) {
    if (attrs) {
      this.statusCode = attrs.statusCode;
      this.message = attrs.message;
      this.error = attrs.error;
    }
  }
}
