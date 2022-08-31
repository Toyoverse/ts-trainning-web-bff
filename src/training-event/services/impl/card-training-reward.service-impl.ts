import { Inject, Injectable } from '@nestjs/common';
import di from 'src/training-event/di';
import { CardTrainingRewardModel } from 'src/training-event/models/card-training-reward.model';
import { CardTrainingRewardMetadataRepository } from 'src/training-event/repositories/card-training-reward-metadata.repository';
import { CardTrainingRewardService } from '../card-training-reward.service';

@Injectable()
export class CardTrainingRewardServiceImpl
  implements CardTrainingRewardService
{
  constructor(
    @Inject(di.CARD_TRAINING_REWARD_METADATA_REPOSITORY)
    private _metadataRepository: CardTrainingRewardMetadataRepository,
  ) {}

  createMetadata(card: CardTrainingRewardModel): Promise<void> {
    return this._metadataRepository.save(card);
  }
}
