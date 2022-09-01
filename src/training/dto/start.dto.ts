import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class TrainingStartDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  trainingId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  playerId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  toyoTokenId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  combination: string[];

  constructor(attrs?: {
    trainingId: string;
    playerId: string;
    toyoTokenId: string;
    combination: string[];
  }) {
    if (attrs) {
      this.trainingId = attrs.trainingId;
      this.playerId = attrs.playerId;
      this.toyoTokenId = attrs.toyoTokenId;
      this.combination = attrs.combination;
    }
  }
}
