import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class TrainingStartRequestDto {
  playerId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  toyoTokenId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  combination: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isAutomata: boolean;

  constructor(attrs?: {
    playerId: string;
    toyoTokenId: string;
    combination: string[];
    isAutomata: boolean;
  }) {
    if (attrs) {
      this.playerId = attrs.playerId;
      this.toyoTokenId = attrs.toyoTokenId;
      this.combination = attrs.combination;
      this.isAutomata = attrs.isAutomata;
    }
  }
}
