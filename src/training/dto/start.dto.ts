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
  combination: string[];

  constructor(attrs?: {
    trainingId: string;
    playerId: string;
    toyoId: string;
    combination: string[];
  }) {
    if (attrs) {
      this.trainingId = attrs.trainingId;
      this.playerId = attrs.playerId;
      this.toyoId = attrs.toyoId;
      this.combination = attrs.combination;
    }
  }
}
