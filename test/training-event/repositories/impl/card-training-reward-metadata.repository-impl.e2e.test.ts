import { CardTrainingRewardModel } from 'src/training-event/models/card-training-reward.model';
import { CardTrainingRewardMetadataRepositoryImpl } from 'src/training-event/repositories/impl/card-training-reward-metadata.repository-impl';

process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_HOST = '18.220.141.105';
process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_PORT = '22';
process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_USERNAME = 'admin';
process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_PRIVATE_KEY = './keyrsa';
process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_PASSPHRASE = '';
process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_DIR =
  '/www/wwwroot/nakatoshivault.dev/nft_metadata/cards';

describe('CardTrainingRewardMetadataRepositoryImpl', () => {
  const repository = new CardTrainingRewardMetadataRepositoryImpl();

  describe('save', () => {
    it('should create, upload and remove file', async () => {
      const model = new CardTrainingRewardModel({
        name: 'Card Reward',
        description: 'Lorem ipsum dolor sit amet.',
        imageUrl: 'https://www.images.com/card.jpeg',
        cardId: '1',
        rotText: 'Lorem ipsum dolor sit amet.',
        type: '1',
        cardCode: '123456',
      });

      await repository.save(model);
    });
  });
});
