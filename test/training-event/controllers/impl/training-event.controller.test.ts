import 'reflect-metadata';
import { HttpStatus } from '@nestjs/common';
import {
  BlowConfigCreateDto,
  TrainingEventCreateDto,
} from 'src/training-event/dto/training-event/create.dto';
import { TrainingEventGetCurrentDto } from 'src/training-event/dto/training-event/get-current.dto';
import { CreateResponse } from 'src/utils/http/responses/create.response';
import { TrainingEventController } from 'src/training-event/controllers/training-event.controller';

describe('Training Event Controller Tests', () => {
  const trainingEventService = {
    create: jest.fn(),
    getCurrent: jest.fn(),
  };
  const trainingEventController = new TrainingEventController(
    trainingEventService,
  );
  describe('Create training event', () => {
    test('Given valid request when create training event then create', async () => {
      const now = new Date();

      const dto = new TrainingEventCreateDto({
        name: 'Training Event',
        startAt: now,
        endAt: now,
        story:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod ante a ante sagittis ultricies.',
        bondReward: 0.75,
        bonusBondReward: 1.25,
        isOngoing: false,
        toyoTrainingConfirmationMessage:
          'Are you sure you want to start training?',
        inTrainingMessage: 'Training Doge',
        losesMessage: 'Sorry, you lost',
        rewardMessage: 'You won, congratulations',
        blows: ['1', '2'],
        blowsConfig: [
          new BlowConfigCreateDto({ duration: 3, qty: 5 }),
          new BlowConfigCreateDto({ duration: 4, qty: 6 }),
        ],
      });

      const id = '7a6f1652-0864-4a87-be10-dc96bcddf76b';

      const expectedResponse = new CreateResponse({
        statusCode: HttpStatus.CREATED,
        message: 'Training event successfully created',
        body: id,
      });

      trainingEventService.create.mockResolvedValue(id);

      const response = await trainingEventController.create(dto);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('Get current training event', () => {
    test('Given valid request when get current training event then return current training event', async () => {
      const now = new Date();

      const mockServiceResponse = new TrainingEventGetCurrentDto({
        id: '7a6f1652-0864-4a87-be10-dc96bcddf76b',
        name: 'Training Event',
        startAt: now,
        endAt: now,
        story:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod ante a ante sagittis ultricies.',
        bondReward: 0.75,
        bonusBondReward: 1.25,
        toyoTrainingConfirmationMessage:
          'Are you sure you want to start training?',
        inTrainingMessage: 'Training Doge',
        losesMessage: 'Sorry, you lost',
        rewardMessage: 'You won, congratulations',
        blows: [
          { id: '1', name: 'Heavy Punch' },
          { id: '2', name: 'Serious Punch' },
        ],
        blowsConfig: [
          { duration: 4, qty: 3 },
          { duration: 5, qty: 4 },
        ],
      });

      trainingEventService.getCurrent.mockResolvedValue(mockServiceResponse);

      const response = await trainingEventController.getCurrent();

      expect(response).toBe(mockServiceResponse);
    });
  });
});
