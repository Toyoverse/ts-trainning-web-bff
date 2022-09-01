import { ApiProperty } from '@nestjs/swagger';

export class CardTrainingRewardGetCurrentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  rotText: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  cardId: string;

  constructor(attrs?: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    rotText: string;
    type: string;
    cardId: string;
  }) {
    if (attrs) {
      this.id = attrs.id;
      this.name = attrs.name;
      this.description = attrs.description;
      this.imageUrl = attrs.imageUrl;
      this.rotText = attrs.rotText;
      this.type = attrs.type;
      this.cardId = attrs.cardId;
    }
  }
}

export class ToyoPersonaTrainingEventGetCurrentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  trainingEventId: string;

  @ApiProperty()
  toyoPersonaId: string;

  @ApiProperty()
  correctBlowsCombinationIds: string[];

  @ApiProperty({ type: () => CardTrainingRewardGetCurrentDto })
  cardReward: CardTrainingRewardGetCurrentDto;

  constructor(attrs?: {
    id: string;
    trainingEventId: string;
    toyoPersonaId: string;
    correctBlowsCombinationIds: string[];
    cardReward: CardTrainingRewardGetCurrentDto;
  }) {
    if (attrs) {
      this.id = attrs.id;
      this.trainingEventId = attrs.trainingEventId;
      this.toyoPersonaId = attrs.toyoPersonaId;
      this.correctBlowsCombinationIds = attrs.correctBlowsCombinationIds;
      this.cardReward = attrs.cardReward;
    }
  }
}
