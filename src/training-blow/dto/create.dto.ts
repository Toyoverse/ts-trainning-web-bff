import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TrainingBlowCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  constructor(attrs?: { name: string; id: string }) {
    if (attrs) {
      this.name = attrs.name;
      this.id = attrs.id;
    }
  }
}
