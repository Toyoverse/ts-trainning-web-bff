import { TrainingEventCreateDto } from 'src/training-event/dto/training-event.dtos';
import { TrainingEventService } from 'src/training-event/services/training-event.service';
import { TrainingEventController } from '../training-event.controller';

describe('Training Event Controller Tests', () => {
  const trainingEventService: TrainingEventService = {
    create: jest.fn(),
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
});
