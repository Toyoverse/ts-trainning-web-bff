import { IsNotEmpty, IsString } from 'class-validator';

export class TrainingBlowCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

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
