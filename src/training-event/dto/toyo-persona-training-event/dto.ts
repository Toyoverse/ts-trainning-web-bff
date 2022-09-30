import { ApiProperty } from '@nestjs/swagger';

export class ToyoPersonaTrainingEventDto {
  id: string;
  trainingEventId: string;
  toyoPersonaId: string;
  combination: string[];
  cardReward: CardTrainingRewardDto;

  constructor(attrs?: {
    id: string;
    trainingEventId: string;
    toyoPersonaId: string;
    combination: string[];
    cardReward: CardTrainingRewardDto;
  }) {
    if (attrs) {
      this.id = attrs.id;
      this.trainingEventId = attrs.trainingEventId;
      this.toyoPersonaId = attrs.toyoPersonaId;
      this.cardReward = attrs.cardReward;
      this.combination = attrs.combination;
    }
  }
}

export class CardTrainingRewardDto {
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

  @ApiProperty()
  cardCode?: string;

  constructor(attrs?: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    rotText: string;
    type: string;
    cardId: string;
    cardCode?: string;
  }) {
    if (attrs) {
      this.id = attrs.id;
      this.name = attrs.name;
      this.description = attrs.description;
      this.imageUrl = attrs.imageUrl;
      this.rotText = attrs.rotText;
      this.type = attrs.type;
      this.cardId = attrs.cardId;
      this.cardCode = attrs.cardCode;
    }
  }
}
