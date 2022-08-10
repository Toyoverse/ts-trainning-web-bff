import { HttpStatus } from '@nestjs/common';
import 'reflect-metadata';
import { TrainingEventCreateDto } from 'src/training-event/dto/training-event/create.dto';
import { TrainingEventGetCurrentDto } from 'src/training-event/dto/training-event/get-current.dto';
import { HttpResponse } from 'src/utils/http/response';
import { TrainingEventController } from '../training-event.controller';

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
        bondReward: 100,
        isOngoing: false,
        toyoTrainingConfirmationMessage:
          'Are you sure you want to start training?',
        inTrainingMessage: 'Training Doge',
        losesMessage: 'Sorry, you lost',
        rewardMessage: 'You won, congratulations',
      });

      const id = '7a6f1652-0864-4a87-be10-dc96bcddf76b';

      const expectedResponse = new HttpResponse({
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
        bondReward: 100,
        toyoTrainingConfirmationMessage:
          'Are you sure you want to start training?',
        inTrainingMessage: 'Training Doge',
        losesMessage: 'Sorry, you lost',
        rewardMessage: 'You won, congratulations',
      });

      trainingEventService.getCurrent.mockResolvedValue(mockServiceResponse);

      const response = await trainingEventController.getCurrent();

      expect(response).toBe(mockServiceResponse);
    });
  });
});
