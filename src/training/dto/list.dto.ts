import { ApiProperty } from '@nestjs/swagger';
import { CardTrainingRewardGetCurrentDto } from 'src/training-event/dto/toyo-persona-training-event/get-current.dto';

export class ListTrainingDto {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  startAt: Date;

  @ApiProperty()
  endAt: Date;

  @ApiProperty()
  claimedAt?: Date;

  @ApiProperty()
  toyoTokenId?: string;

  @ApiProperty()
  signature?: string;

  @ApiProperty()
  combination: string[];

  @ApiProperty()
  card?: CardTrainingRewardGetCurrentDto;

  @ApiProperty()
  isAutomata: boolean;

  constructor(attrs: {
    id?: string;
    startAt: Date;
    endAt: Date;
    claimedAt?: Date;
    toyoTokenId?: string;
    signature?: string;
    combination: string[];
    card?: CardTrainingRewardGetCurrentDto;
    isAutomata: boolean;
  }) {
    this.id = attrs.id;
    this.startAt = attrs.startAt;
    this.endAt = attrs.endAt;
    this.claimedAt = attrs.claimedAt;
    this.toyoTokenId = attrs.toyoTokenId;
    this.signature = attrs.signature;
    this.combination = attrs.combination;
    this.card = attrs.card;
    this.isAutomata = attrs.isAutomata;
  }
}
