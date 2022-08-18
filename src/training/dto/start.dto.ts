import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class TrainingStartDto {
  @IsNotEmpty()
  @IsString()
  trainingId: string;

  @IsNotEmpty()
  @IsString()
  playerId: string;

  @IsNotEmpty()
  @IsString()
  toyoId: string;

  @IsNotEmpty()
  @IsArray()
  sequence: string[];

  constructor(attrs?: {
    trainingId: string;
    playerId: string;
    toyoId: string;
    sequence: string[];
  }) {
    if (attrs) {
      this.trainingId = attrs.trainingId;
      this.playerId = attrs.playerId;
      this.toyoId = attrs.toyoId;
      this.sequence = attrs.sequence;
    }
  }
}
