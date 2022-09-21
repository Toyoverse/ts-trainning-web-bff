import { CardTrainingRewardModel } from '../models/card-training-reward.model';

export interface CardTrainingRewardService {
  createMetadata(card: CardTrainingRewardModel): Promise<void>;
}
