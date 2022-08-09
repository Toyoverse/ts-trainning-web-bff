export class TrainingEventGetCurrentDto {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  bondReward: number;
  inTrainingMessage: string;
  losesMessage: string;
  rewardMessage: string;

  constructor(attrs?: {
    id: string;
    name: string;
    startAt: Date;
    endAt: Date;
    bondReward: number;
    inTrainingMessage: string;
    losesMessage: string;
    rewardMessage: string;
  }) {
    if (attrs) {
      this.id = attrs.id;
      this.name = attrs.name;
      this.startAt = attrs.startAt;
      this.endAt = attrs.endAt;
      this.bondReward = attrs.bondReward;
      this.inTrainingMessage = attrs.inTrainingMessage;
      this.losesMessage = attrs.losesMessage;
      this.rewardMessage = attrs.rewardMessage;
    }
  }
}
