import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class TrainingStartDto {
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
    playerId: string;
    toyoTokenId: string;
    combination: string[];
  }) {
    if (attrs) {
      this.playerId = attrs.playerId;
      this.toyoTokenId = attrs.toyoTokenId;
      this.combination = attrs.combination;
    }
  }
}
