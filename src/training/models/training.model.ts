import { CardTrainingRewardGetCurrentDto } from 'src/training-event/dto/toyo-persona-training-event/get-current.dto';

export class TrainingModel {
  id?: string;
  startAt: Date | number;
  endAt: Date | number;
  claimedAt: Date | number;
  bond?: number;
  toyoTokenId?: string;
  signature: string;
  combination: string[];
  isCombinationCorrect?: boolean;
  card?: CardTrainingRewardGetCurrentDto;

  constructor(attrs: {
    id?: string;
    startAt: Date | number;
    endAt: Date | number;
    claimedAt: Date | number;
    bond?: number;
    toyoTokenId?: string;
    signature: string;
    combination: string[];
    isCombinationCorrect?: boolean;
    card?: CardTrainingRewardGetCurrentDto;
  }) {
    this.id = attrs.id;
    this.startAt = attrs.startAt;
    this.endAt = attrs.endAt;
    this.claimedAt = attrs.claimedAt;
    this.bond = attrs.bond;
    this.toyoTokenId = attrs.toyoTokenId;
    this.signature = attrs.signature;
    this.combination = attrs.combination;
    this.isCombinationCorrect = attrs.isCombinationCorrect;
    this.card = attrs.card;
  }
}
