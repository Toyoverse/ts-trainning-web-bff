import { CardTrainingRewardModel } from './card-training-reward.model';

export class ToyoPersonaTrainingEventModel {
  id?: string;
  trainingEventId: string;
  toyoPersonaId: string;
  correctBlowsCombinationIds: string[];
  cardReward: CardTrainingRewardModel;

  constructor(attrs?: {
    id?: string;
    trainingEventId: string;
    toyoPersonaId: string;
    correctBlowsCombinationIds: string[];
    cardReward: CardTrainingRewardModel;
  }) {
    if (attrs) {
      this.id = attrs.id;
      this.trainingEventId = attrs.trainingEventId;
      this.toyoPersonaId = attrs.toyoPersonaId;
      this.correctBlowsCombinationIds = attrs.correctBlowsCombinationIds;
      this.cardReward = attrs.cardReward;
    }
  }
}
