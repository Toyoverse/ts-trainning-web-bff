export class TrainingEventDto {
  id?: string;
  name: string;
  startAt: Date;
  endAt: Date;
  story: string;
  isOngoing: boolean;
  bondReward: number;
  bonusBondReward: number;
  toyoTrainingConfirmationMessage: string;
  inTrainingMessage: string;
  losesMessage: string;
  rewardMessage: string;
  blows: string[];
  blowsConfig: BlowConfigDto[];

  constructor(attrs: {
    id?: string;
    name: string;
    startAt: Date;
    endAt: Date;
    story: string;
    isOngoing: boolean;
    bondReward: number;
    bonusBondReward: number;
    toyoTrainingConfirmationMessage: string;
    inTrainingMessage: string;
    losesMessage: string;
    rewardMessage: string;
    blows: string[];
    blowsConfig: BlowConfigDto[];
  }) {
    this.id = attrs.id;
    this.name = attrs.name;
    this.startAt = attrs.startAt;
    this.endAt = attrs.endAt;
    this.story = attrs.story;
    this.isOngoing = attrs.isOngoing;
    this.bondReward = attrs.bondReward;
    this.bonusBondReward = attrs.bonusBondReward;
    this.toyoTrainingConfirmationMessage =
      attrs.toyoTrainingConfirmationMessage;
    this.inTrainingMessage = attrs.inTrainingMessage;
    this.losesMessage = attrs.losesMessage;
    this.rewardMessage = attrs.rewardMessage;
    this.blows = attrs.blows;
    this.blowsConfig = attrs.blowsConfig;
  }
}

export class BlowConfigDto {
  duration: number;
  qty: number;

  constructor(attrs?: { duration: number; qty: number }) {
    if (attrs) {
      this.duration = attrs.duration;
      this.qty = attrs.qty;
    }
  }
}
