import { HttpStatus } from '@nestjs/common';
import { ToyoPersonaTrainingEventController } from 'src/training-event/controllers/toyo-persona-training-event.controller';
import { CreateResponse } from 'src/utils/http/responses';
import {
  CardTrainingRewardCreateDto,
  ToyoPersonaTrainingEventCreateDto,
} from 'src/training-event/dto/toyo-persona-training-event/create.dto';

describe('Toyo persona training events controller tests', () => {
  const mockService = {
    create: jest.fn(),
  };

  const controller = new ToyoPersonaTrainingEventController(mockService);
  describe('Create toyo persona training event', () => {
    test('Given valid dto then create', async () => {
      const body = new ToyoPersonaTrainingEventCreateDto({
        trainingEventId: '1',
        toyoPersonaId: '1',
        correctBlowsCombinationIds: ['1', '3', '5', '8'],
        cardReward: new CardTrainingRewardCreateDto({
          name: 'Card Reward',
          description: 'Lorem ipsum dolor sit amet.',
          cardId: '1',
          rotText: 'Lorem ipsum dolor sit amet.',
          type: '1',
        }),
      });

      const mockId = '7a6f1652-0864-4a87-be10-dc96bcddf76b';

      mockService.create.mockResolvedValue(mockId);

      const expectedResponse = new CreateResponse({
        statusCode: HttpStatus.CREATED,
        message: 'Toyo persona training event has been successfully created',
        body: mockId,
      });
      const response = await controller.create(body);

      expect(response).toEqual(expectedResponse);
    });
  });
});
