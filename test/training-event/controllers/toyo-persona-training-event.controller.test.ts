import { HttpStatus } from '@nestjs/common';
import { ToyoPersonaTrainingEventController } from 'src/training-event/controllers/toyo-persona-training-event.controller';
import { CreateResponse } from 'src/utils/http/responses';
import {
  CardTrainingRewardCreateDto,
  ToyoPersonaTrainingEventCreateDto,
} from 'src/training-event/dto/toyo-persona-training-event/create.dto';
import {
  CardTrainingRewardGetCurrentDto,
  ToyoPersonaTrainingEventGetCurrentDto,
} from 'src/training-event/dto/toyo-persona-training-event/get-current.dto';
import { when } from 'jest-when';

describe('Toyo persona training events controller tests', () => {
  const mockService = {
    create: jest.fn(),
    getCurrent: jest.fn(),
  };

  const controller = new ToyoPersonaTrainingEventController(mockService as any);
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
  describe('Get current toyo persona training event', () => {
    test('Return current toyo persona training event', async () => {
      const toyoPersonaId = '1';

      const expectedResponse = new ToyoPersonaTrainingEventGetCurrentDto({
        id: '1',
        trainingEventId: '1',
        toyoPersonaId,
        correctBlowsCombinationIds: ['1', '3', '5', '8'],
        cardReward: new CardTrainingRewardGetCurrentDto({
          id: '1',
          name: 'Card Reward',
          description: 'Lorem ipsum dolor sit amet.',
          cardId: '1',
          rotText: 'Lorem ipsum dolor sit amet.',
          type: '1',
        }),
      });

      when(mockService.getCurrent)
        .calledWith(toyoPersonaId)
        .mockResolvedValue(expectedResponse);

      const response = await controller.getCurrent(toyoPersonaId);

      expect(response).toEqual(expectedResponse);
    });
  });
});
