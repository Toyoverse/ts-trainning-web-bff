import { ApiProperty } from '@nestjs/swagger';
import { CardTrainingRewardGetCurrentDto } from 'src/training-event/dto/toyo-persona-training-event/get-current.dto';

export class ListTrainingDto {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  startAt: Date | number;

  @ApiProperty()
  endAt: Date | number;

  @ApiProperty()
  claimedAt: Date | number;

  @ApiProperty()
  toyoTokenId?: string;

  @ApiProperty()
  signature: string;

  @ApiProperty()
  combination: string[];

  @ApiProperty()
  card?: CardTrainingRewardGetCurrentDto;

  constructor(attrs: {
    id?: string;
    startAt: Date | number;
    endAt: Date | number;
    claimedAt: Date | number;
    toyoTokenId?: string;
    signature: string;
    combination: string[];
    card?: CardTrainingRewardGetCurrentDto;
  }) {
    this.id = attrs.id;
    this.startAt = attrs.startAt;
    this.endAt = attrs.endAt;
    this.claimedAt = attrs.claimedAt;
    this.toyoTokenId = attrs.toyoTokenId;
    this.signature = attrs.signature;
    this.combination = attrs.combination;
    this.card = attrs.card;
  }
}
