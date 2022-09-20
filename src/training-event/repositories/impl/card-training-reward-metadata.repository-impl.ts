import { Injectable } from '@nestjs/common';
import { CardTrainingRewardModel } from 'src/training-event/models/card-training-reward.model';
import { CardTrainingRewardMetadataRepository } from '../card-training-reward-metadata.repository';
import { NodeSSH } from 'node-ssh';

@Injectable()
export class CardTrainingRewardMetadataRepositoryImpl
  implements CardTrainingRewardMetadataRepository
{
  async save(model: CardTrainingRewardModel): Promise<any> {
    const sshClient = new NodeSSH();

    await sshClient.connect({
      host: process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_HOST,
      username: process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_USERNAME,
      privateKeyPath:
        process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_PRIVATE_KEY,
    });

    const json = JSON.stringify(model);

    await sshClient.execCommand(`echo '${json}' > ${model.cardCode}.json`, {
      cwd: process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_DIR,
    });

    sshClient.dispose();
  }
}
