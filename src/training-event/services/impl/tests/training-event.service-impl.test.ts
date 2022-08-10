import { NotFoundException } from '@nestjs/common';
import 'reflect-metadata';

import { TrainingEventModel } from 'src/training-event/models/training-event.model';
import { TrainingEventCreateDto } from '../../../dto/training-event/create.dto';
import { TrainingEventServiceImpl } from '../training-event.service-impl';

describe('Training event service tests', () => {
  const trainingEventRepository = {
    save: jest.fn(),
    getCurrent: jest.fn(),
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

  describe('Get current training event', () => {
    test('When get current then return current training event', async () => {
      const now = new Date();
      const mockRepositoryResponse = new TrainingEventModel({
        id: '7a6f1652-0864-4a87-be10-dc96bcddf76b',
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

      trainingEventRepository.getCurrent.mockResolvedValue(
        mockRepositoryResponse,
      );

      const response = await trainingEventService.getCurrent();
      expect(response.id).toEqual(mockRepositoryResponse.id);
      expect(response.name).toEqual(mockRepositoryResponse.name);
      expect(response.startAt).toEqual(mockRepositoryResponse.startAt);
      expect(response.endAt).toEqual(mockRepositoryResponse.endAt);
      expect(response.bondReward).toEqual(mockRepositoryResponse.bondReward);
      expect(response.inTrainingMessage).toEqual(
        mockRepositoryResponse.inTrainingMessage,
      );
      expect(response.losesMessage).toEqual(
        mockRepositoryResponse.losesMessage,
      );
      expect(response.rewardMessage).toEqual(
        mockRepositoryResponse.rewardMessage,
      );
    });
    test('When get current training and there is no current training then throw not found exception', async () => {
      trainingEventRepository.getCurrent.mockResolvedValue(undefined);
      const t = async () => await trainingEventService.getCurrent();
      await expect(t).rejects.toThrow(NotFoundException);
    });
  });
});
