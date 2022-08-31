import { CardTrainingRewardMetadataRepositoryImpl } from 'src/training-event/repositories/impl/card-training-reward-metadata.repository-impl';
import * as fs from 'fs';
import * as path from 'path';
import { CardTrainingRewardModel } from 'src/training-event/models/card-training-reward.model';

jest.mock('fs');

const cardsMetaDirectory = './files/cards';
process.env.CARD_TRAINING_REWARD_METADATA_DIRECTORY = cardsMetaDirectory;

describe('Card training reward metadata repository tests', () => {
  const repository = new CardTrainingRewardMetadataRepositoryImpl();

  describe('Save metadata', () => {
    it('Should save', async () => {
      const card = new CardTrainingRewardModel({
        name: 'Card Reward',
        description: 'Lorem ipsum dolor sit amet.',
        imageUrl: 'https://www.images.com/card.jpeg',
        imageDescription: 'Lorem ipsum dolor sit amet.',
        cardId: '1',
        rotText: 'Lorem ipsum dolor sit amet.',
        type: '1',
      });

      const jsonMetadata = JSON.stringify(card.getMetadata());

      const mockFs = jest.mocked(fs);
      mockFs.existsSync.mockReturnValue(true);

      await repository.save(card);

      const filePath = path.join(cardsMetaDirectory, card.id + '.json');

      expect(mockFs.writeFileSync).toBeCalledWith(
        filePath,
        jsonMetadata,
        'utf-8',
      );
    });
    it('Should create directory if it does not exist', async () => {
      const card = new CardTrainingRewardModel({
        name: 'Card Reward',
        description: 'Lorem ipsum dolor sit amet.',
        imageUrl: 'https://www.images.com/card.jpeg',
        imageDescription: 'Lorem ipsum dolor sit amet.',
        cardId: '1',
        rotText: 'Lorem ipsum dolor sit amet.',
        type: '1',
      });

      const mockFs = jest.mocked(fs);
      mockFs.existsSync.mockReturnValue(false);
      await repository.save(card);

      expect(mockFs.mkdirSync).toBeCalledWith(cardsMetaDirectory, {
        recursive: true,
      });
    });
  });
});
