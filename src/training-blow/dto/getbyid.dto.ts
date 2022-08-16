import { ApiProperty } from '@nestjs/swagger';

export class TrainingBlowGetByIdDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;

  constructor(attrs?: { id: string; name: string }) {
    if (attrs) {
      this.id = attrs.id;
      this.name = attrs.name;
    }
  }
}
