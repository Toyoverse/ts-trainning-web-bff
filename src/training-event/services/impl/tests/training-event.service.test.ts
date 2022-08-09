import { TrainingEventModel } from 'src/training-event/models/training-event.model';
import { TrainingEventCreateDto } from '../../../dto/training-event.dtos';
import { TrainingEventServiceImpl } from '../training-event.service';

describe('Training event service tests', () => {
  const trainingEventRepository = {
    save: jest.fn(),
  };
  const trainingEventService = new TrainingEventServiceImpl(
    trainingEventRepository,
  );

  describe('Create training events', () => {
    test('Given valid request then save training event', async () => {
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

      const expectedSavedModel = new TrainingEventModel(dto);

      const repositoryResponse = new TrainingEventModel({
        ...dto,
        id: '7a6f1652-0864-4a87-be10-dc96bcddf76b',
      });

      trainingEventRepository.save.mockResolvedValue(repositoryResponse);

      const id = await trainingEventService.create(dto);

      expect(trainingEventRepository.save).toBeCalledWith(expectedSavedModel);

      expect(repositoryResponse.id).toEqual(id);
    });
  });
});
