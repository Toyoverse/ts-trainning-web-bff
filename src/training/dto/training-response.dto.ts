import { CardTrainingRewardGetCurrentDto } from 'src/training-event/dto/toyo-persona-training-event/get-current.dto';

export class TrainingResponseDto {
  id?: string;
  startAt: Date | number;
  endAt: Date | number;
  claimedAt?: Date | number;
  bond?: number | string;
  toyoTokenId?: string;
  signature?: string;
  combination: string[];
  isCombinationCorrect?: boolean;
  combinationResult?: object;
  card?: CardTrainingRewardGetCurrentDto;
  isAutomata: boolean;

  constructor(attrs: {
    id?: string;
    startAt: Date | number;
    endAt: Date | number;
    claimedAt?: Date | number;
    bond?: number | string;
    toyoTokenId?: string;
    signature?: string;
    combination: string[];
    isCombinationCorrect?: boolean;
    combinationResult?: object;
    card?: CardTrainingRewardGetCurrentDto;
    isAutomata: boolean;
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
    this.combinationResult = attrs.combinationResult;
    this.isAutomata = attrs.isAutomata;
  }
}
