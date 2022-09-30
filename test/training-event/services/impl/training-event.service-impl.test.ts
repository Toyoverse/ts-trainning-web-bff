import 'reflect-metadata';

import { TrainingEventModel } from 'src/training-event/models/training-event.model';
import {
  BlowConfigCreateDto,
  TrainingEventCreateDto,
} from 'src/training-event/dto/training-event/create.dto';
import { TrainingEventServiceImpl } from 'src/training-event/services/impl/training-event.service-impl';
import { ConstraintViolationError, NotFoundError } from 'src/errors';
import { when } from 'jest-when';
import { TrainingEventRepository } from 'src/training-event/repositories/training-event.repository';

describe('Training event service tests', () => {
  const trainingEventRepository: Partial<jest.Mocked<TrainingEventRepository>> =
    {
      save: jest.fn(),
      getCurrent: jest.fn(),
      isDatesConflicting: jest.fn(),
      getById: jest.fn(),
    };

  const trainingBlowService = {
    getById: jest.fn(),
  };

  const trainingEventService = new TrainingEventServiceImpl(
    trainingEventRepository as any,
    trainingBlowService as any,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Create training events', () => {
    test('Given valid request then save training event', async () => {
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
        blows: ['1', '2', '3'],
        blowsConfig: [
          new BlowConfigCreateDto({ duration: 3, qty: 5 }),
          new BlowConfigCreateDto({ duration: 4, qty: 6 }),
        ],
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

    test('Given dto with unexisting blows then throw exception', async () => {
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
        blows: ['1', '2', '3'],
        blowsConfig: [
          new BlowConfigCreateDto({ duration: 3, qty: 5 }),
          new BlowConfigCreateDto({ duration: 4, qty: 6 }),
        ],
      });

      when(trainingBlowService.getById)
        .calledWith('2')
        .mockRejectedValue(new NotFoundError());

      const t = async () => await trainingEventService.create(dto);
      await expect(t).rejects.toThrow(ConstraintViolationError);
    });

    test('When fail to get blows and error is unexpected then re-throw error', async () => {
      const dto = new TrainingEventCreateDto({
        blows: ['1', '2', '3'],
      } as any);

      const unexpectedError = new Error();
      when(trainingBlowService.getById)
        .calledWith('2')
        .mockRejectedValue(unexpectedError);

      const t = async () => await trainingEventService.create(dto);
      await expect(t).rejects.toThrow(unexpectedError);
    });

    test('When date is conflicting then throw constraint violation exception', async () => {
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
        blows: ['1', '2', '3'],
        blowsConfig: [
          new BlowConfigCreateDto({ duration: 3, qty: 5 }),
          new BlowConfigCreateDto({ duration: 4, qty: 6 }),
        ],
      });

      when(trainingEventRepository.isDatesConflicting)
        .calledWith(dto.startAt, dto.endAt)
        .mockResolvedValue(true);

      const t = async () => await trainingEventService.create(dto);

      await expect(t).rejects.toThrow(
        new ConstraintViolationError(
          'There is already an event scheduled in this period',
        ),
      );
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
          { duration: 4, qty: 3 },
          { duration: 5, qty: 4 },
        ],
      });

      trainingEventRepository.getCurrent.mockResolvedValue(
        mockRepositoryResponse,
      );

      for (const blowId of mockRepositoryResponse.blows) {
        trainingBlowService.getById.mockImplementation(() => {
          return { id: blowId, name: `Heavy Punch ${blowId}` };
        });
      }

      const response = await trainingEventService.getCurrent();
      expect(response.id).toEqual(mockRepositoryResponse.id);
      expect(response.name).toEqual(mockRepositoryResponse.name);
      expect(response.startAt).toEqual(mockRepositoryResponse.startAt);
      expect(response.endAt).toEqual(mockRepositoryResponse.endAt);
      expect(response.bondReward).toEqual(mockRepositoryResponse.bondReward);
      expect(response.bonusBondReward).toEqual(
        mockRepositoryResponse.bonusBondReward,
      );
      expect(response.inTrainingMessage).toEqual(
        mockRepositoryResponse.inTrainingMessage,
      );
      expect(response.losesMessage).toEqual(
        mockRepositoryResponse.losesMessage,
      );
      expect(response.rewardMessage).toEqual(
        mockRepositoryResponse.rewardMessage,
      );
      expect(response.blowsConfig).toEqual(mockRepositoryResponse.blowsConfig);
    });
    test('When get current training and there is no current training then throw not found exception', async () => {
      trainingEventRepository.getCurrent.mockResolvedValue(undefined);
      const t = async () => await trainingEventService.getCurrent();
      await expect(t).rejects.toThrow(NotFoundError);
    });
  });

  describe('getById', () => {
    it('should return training event', async () => {
      const id = 'k3f8i3';
      const model = new TrainingEventModel({
        id,
        name: 'Training Event',
        startAt: new Date('2020-02-02'),
        endAt: new Date('2020-02-09'),
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
          { duration: 4, qty: 3 },
          { duration: 5, qty: 4 },
        ],
      });

      when(trainingEventRepository.getById)
        .calledWith(id)
        .mockResolvedValue(model);

      const resp = await trainingEventService.getById(id);

      expect(resp).toEqual(model);
    });

    it('should throw not found error when there is no training with id', async () => {
      const id = 'k3f8i3';

      when(trainingEventRepository.getById)
        .calledWith(id)
        .mockResolvedValue(undefined);

      const t = async () => trainingEventService.getById(id);

      await expect(t).rejects.toThrow(NotFoundError);
    });
  });
});
