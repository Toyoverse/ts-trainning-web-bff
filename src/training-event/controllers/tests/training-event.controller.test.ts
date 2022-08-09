import 'reflect-metadata';
import { TrainingEventCreateDto } from 'src/training-event/dto/training-event/create.dto';
import { TrainingEventGetCurrentDto } from 'src/training-event/dto/training-event/get-current.dto';
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
        bondReward: 100,
        isOngoing: false,
        inTrainingMessage: 'Training Doge',
        losesMessage: 'Sorry, you lost',
        rewardMessage: 'You won, congratulations',
      });

      await trainingEventController.createTrainingEvent(dto);

      expect(trainingEventService.create).toBeCalled();
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
        bondReward: 100,
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
