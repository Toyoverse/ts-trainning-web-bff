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
  toyoTrainingConfirmationMessage: string;
  inTrainingMessage: string;
  losesMessage: string;
  rewardMessage: string;

  constructor(attrs?: {
    id: string;
    name: string;
    startAt: Date;
    endAt: Date;
    story: string;
    bondReward: number;
    toyoTrainingConfirmationMessage: string;
    inTrainingMessage: string;
    losesMessage: string;
    rewardMessage: string;
  }) {
    if (attrs) {
      this.id = attrs.id;
      this.name = attrs.name;
      this.startAt = attrs.startAt;
      this.endAt = attrs.endAt;
      this.story = attrs.story;
      this.bondReward = attrs.bondReward;
      this.toyoTrainingConfirmationMessage =
        attrs.toyoTrainingConfirmationMessage;
      this.inTrainingMessage = attrs.inTrainingMessage;
      this.losesMessage = attrs.losesMessage;
      this.rewardMessage = attrs.rewardMessage;
    }
  }
}
