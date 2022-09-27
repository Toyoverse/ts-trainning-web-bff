import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SuccessResponse {
  @ApiProperty()
  statusCode: number;
  @ApiPropertyOptional()
  message?: string;
  @ApiPropertyOptional()
  body?: any;

  constructor(attrs?: { statusCode: number; message?: string; body?: any }) {
    if (attrs) {
      this.statusCode = attrs.statusCode;
      this.message = attrs.message;
      this.body = attrs.body;
    }
  }
}
