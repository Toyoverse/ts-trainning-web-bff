import { Transform } from 'class-transformer';

export class TrainingEventGetCurrentDto {
  id: string;
  name: string;
  @Transform(({ value }) => value.getTime())
  startAt: Date;
  @Transform(({ value }) => value.getTime())
  endAt: Date;
  story: string;
  bondReward: number;
  bonusBondReward: number;
  toyoTrainingConfirmationMessage: string;
  inTrainingMessage: string;
  losesMessage: string;
  rewardMessage: string;
  blows: TrainingBlowGetCurrentDto[];
  blowsConfig: BlowConfigGetCurrentDto[];

  constructor(attrs?: {
    id: string;
    name: string;
    startAt: Date;
    endAt: Date;
    story: string;
    bondReward: number;
    bonusBondReward: number;
    toyoTrainingConfirmationMessage: string;
    inTrainingMessage: string;
    losesMessage: string;
    rewardMessage: string;
    blows: TrainingBlowGetCurrentDto[];
    blowsConfig: BlowConfigGetCurrentDto[];
  }) {
    if (attrs) {
      Object.assign(this, attrs);
    }
  }
}

export class TrainingBlowGetCurrentDto {
  id: string;
  name: string;

  constructor(attrs?: { id: string; name: string }) {
    if (attrs) {
      this.id = attrs.id;
      this.name = attrs.name;
    }
  }
}

export class BlowConfigGetCurrentDto {
  duration: number;
  qty: number;

  constructor(attrs?: { duration: number; qty: number }) {
    if (attrs) {
      this.duration = attrs.duration;
      this.qty = attrs.qty;
    }
  }
}
