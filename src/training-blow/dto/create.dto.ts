import { IsNotEmpty, IsString } from 'class-validator';

export class TrainingBlowCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  blowId: string;

  constructor(attrs?: { name: string; blowId: string }) {
    if (attrs) {
      this.name = attrs.name;
      this.blowId = attrs.blowId;
    }
  }
}
