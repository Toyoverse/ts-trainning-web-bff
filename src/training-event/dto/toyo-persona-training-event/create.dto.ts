import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CardTrainingRewardCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  imageDescription: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  rotText: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cardId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  constructor(attrs?: {
    name: string;
    description: string;
    imageDescription: string;
    rotText: string;
    type: string;
    cardId: string;
    imageUrl: string;
  }) {
    if (attrs) {
      Object.assign(this, attrs);
    }
  }
}

export class ToyoPersonaTrainingEventCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  trainingEventId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  toyoPersonaId: string;

  @ApiProperty()
  @IsString({ each: true })
  correctBlowsCombinationIds: string[];

  @ApiProperty({ type: () => CardTrainingRewardCreateDto })
  @ValidateNested()
  @Type(() => CardTrainingRewardCreateDto)
  cardReward: CardTrainingRewardCreateDto;

  constructor(attrs?: {
    trainingEventId: string;
    toyoPersonaId: string;
    correctBlowsCombinationIds: string[];
    cardReward: CardTrainingRewardCreateDto;
  }) {
    if (attrs) {
      Object.assign(this, attrs);
    }
  }
}
