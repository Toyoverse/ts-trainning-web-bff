import 'reflect-metadata';

import { CardTrainingRewardServiceImpl } from 'src/training-event/services/impl/card-training-reward.service-impl';
import { CardTrainingRewardModel } from 'src/training-event/models/card-training-reward.model';

describe('Card training reward service tests', () => {
  const metadataRepository = {
    save: jest.fn(),
  };

  const service = new CardTrainingRewardServiceImpl(metadataRepository);

  describe('Create card training reward metadata', () => {
    it('Should create metadata', async () => {
      const card = new CardTrainingRewardModel({
        name: 'Card Reward',
        description: 'Lorem ipsum dolor sit amet.',
        imageUrl: 'https://www.images.com/card.jpeg',
        cardId: '1',
        rotText: 'Lorem ipsum dolor sit amet.',
        type: '1',
      });

      await service.createMetadata(card);

      expect(metadataRepository.save).toBeCalledWith(card);
    });
  });
});
