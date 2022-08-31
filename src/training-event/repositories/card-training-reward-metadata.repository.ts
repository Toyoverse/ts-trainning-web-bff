import { CardTrainingRewardModel } from '../models/card-training-reward.model';

export interface CardTrainingRewardMetadataRepository {
  save(card: CardTrainingRewardModel): Promise<void>;
}
