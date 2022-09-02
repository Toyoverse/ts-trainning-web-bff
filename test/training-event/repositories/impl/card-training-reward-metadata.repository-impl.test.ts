import * as fs from 'fs';
import * as path from 'path';
import * as CryptoJS from 'crypto-js';

import { CardTrainingRewardMetadataRepositoryImpl } from 'src/training-event/repositories/impl/card-training-reward-metadata.repository-impl';
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
        cardId: '1',
        rotText: 'Lorem ipsum dolor sit amet.',
        type: '1',
      });

      const jsonMetadata = JSON.stringify(card.getMetadata());

      const fileName = 'd41d8cd98f00b204e900998ecf8427e';

      jest.spyOn(CryptoJS, 'MD5').mockImplementation(() => {
        return {
          toString: () => fileName,
        } as any;
      });

      const mockFs = jest.mocked(fs);
      mockFs.existsSync.mockReturnValue(true);

      await repository.save(card);

      const filePath = path.join(cardsMetaDirectory, fileName + '.json');

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
