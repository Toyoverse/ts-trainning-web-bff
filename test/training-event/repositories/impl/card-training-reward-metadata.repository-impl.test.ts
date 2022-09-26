import { NodeSSH } from 'node-ssh';
import { CardTrainingRewardModel } from 'src/training-event/models/card-training-reward.model';
import { CardTrainingRewardMetadataRepositoryImpl } from 'src/training-event/repositories/impl/card-training-reward-metadata.repository-impl';

jest.mock('node-ssh');

process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_HOST = 'localhost';
process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_PORT = '22';
process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_USERNAME = 'admin';
process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_PRIVATE_KEY =
  '~\\.ssh\\id_ed25519';
process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_DIR =
  '/www/toyoverse/metadata/cards';

describe('CardTrainingRewardMetadataRepositoryImpl', () => {
  const repository = new CardTrainingRewardMetadataRepositoryImpl();

  describe('save', () => {
    it('should create file in remote server', async () => {
      const model = new CardTrainingRewardModel({
        name: 'Card Reward',
        description: 'Lorem ipsum dolor sit amet.',
        imageUrl: 'https://www.images.com/card.jpeg',
        cardId: '1',
        rotText: 'Lorem ipsum dolor sit amet.',
        type: '1',
        cardCode: 'fda3f5467',
      });

      const json = JSON.stringify(model);

      const mockNodeSSHConstructor = jest.mocked(NodeSSH);

      const mockNodeSSH: Partial<jest.Mocked<NodeSSH>> = {
        connect: jest.fn(),
        execCommand: jest.fn(),
        dispose: jest.fn(),
      };

      mockNodeSSHConstructor.mockReturnValue(mockNodeSSH as any);

      await repository.save(model);

      expect(mockNodeSSH.connect).toBeCalledWith({
        host: process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_HOST,
        username: process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_USERNAME,
        privateKeyPath:
          process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_PRIVATE_KEY,
      });

      expect(mockNodeSSH.execCommand).toBeCalledWith(
        `echo '${json}' > ${model.cardCode}.json`,
        {
          cwd: process.env.CARD_TRAINING_REWARD_METADATA_REMOTE_DIR,
        },
      );

      expect(mockNodeSSH.dispose).toBeCalled();
    });
  });
});
