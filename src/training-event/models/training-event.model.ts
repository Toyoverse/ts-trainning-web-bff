export class TrainingEventModel {
  id?: string;
  name: string;
  startAt: Date;
  endAt: Date;
  isOngoing: boolean;
  bondReward: number;
  inTrainingMessage: string;
  losesMessage: string;
  rewardMessage: string;

  constructor(attrs: {
    id?: string;
    name: string;
    startAt: Date;
    endAt: Date;
    isOngoing: boolean;
    bondReward: number;
    inTrainingMessage: string;
    losesMessage: string;
    rewardMessage: string;
  }) {
    this.id = attrs.id;
    this.name = attrs.name;
    this.startAt = attrs.startAt;
    this.endAt = attrs.endAt;
    this.isOngoing = attrs.isOngoing;
    this.bondReward = attrs.bondReward;
    this.inTrainingMessage = attrs.inTrainingMessage;
    this.losesMessage = attrs.losesMessage;
    this.rewardMessage = attrs.rewardMessage;
  }
}
