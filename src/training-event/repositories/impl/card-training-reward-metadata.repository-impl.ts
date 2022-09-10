import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as CryptoJS from 'crypto-js';
import { CardTrainingRewardModel } from 'src/training-event/models/card-training-reward.model';
import { CardTrainingRewardMetadataRepository } from '../card-training-reward-metadata.repository';

@Injectable()
export class CardTrainingRewardMetadataRepositoryImpl
  implements CardTrainingRewardMetadataRepository
{
  private readonly CARDS_META_DIRECTORY =
    process.env.CARD_TRAINING_REWARD_METADATA_DIRECTORY;

  async save(card: CardTrainingRewardModel): Promise<any> {
    if (!fs.existsSync(this.CARDS_META_DIRECTORY)) {
      fs.mkdirSync(this.CARDS_META_DIRECTORY, { recursive: true });
    }

    const fileName = `${card.cardCode}.json`;

    const filePath = path.join(this.CARDS_META_DIRECTORY, fileName);
    const jsonMetadata = JSON.stringify(card.getMetadata());

    fs.writeFileSync(filePath, jsonMetadata, 'utf-8');
  }
}
