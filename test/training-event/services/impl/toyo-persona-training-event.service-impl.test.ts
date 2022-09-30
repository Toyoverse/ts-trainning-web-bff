import { when } from 'jest-when';
import 'reflect-metadata';
import { ConstraintViolationError, NotFoundError } from 'src/errors';
import { TrainingBlowGetByIdDto } from 'src/training-blow/dto/getbyid.dto';
import {
  CardTrainingRewardCreateDto,
  ToyoPersonaTrainingEventCreateDto,
} from 'src/training-event/dto/toyo-persona-training-event/create.dto';
import { ToyoPersonaTrainingEventGetCurrentDto } from 'src/training-event/dto/toyo-persona-training-event/get-current.dto';
import { CardTrainingRewardModel } from 'src/training-event/models/card-training-reward.model';
import { ToyoPersonaTrainingEventModel } from 'src/training-event/models/toyo-persona-training-event.model';
import { ToyoPersonaTrainingEventRepository } from 'src/training-event/repositories/toyo-persona-training-event.repository';
import { ToyoPersonaTrainingEventServiceImpl } from 'src/training-event/services/impl/toyo-persona-training-event.service-impl';

describe('Toyo persona training event service impl tests', () => {
  const mockRepository: jest.Mocked<ToyoPersonaTrainingEventRepository> = {
    save: jest.fn(),
    getByTrainingEventAndPersona: jest.fn(),
  };

  const mockTrainingEventService = {
    getCurrent: jest.fn(),
  };

  const mockBlowsService = {
    getById: jest.fn(),
  };

  const mockToyoPersonaService = {
    getById: jest.fn(),
  };

  const mockCardTrainingRewardService = {
    createMetadata: jest.fn(),
  };

  const service = new ToyoPersonaTrainingEventServiceImpl(
    mockRepository as any,
    mockTrainingEventService as any,
    mockBlowsService as any,
    mockToyoPersonaService as any,
    mockCardTrainingRewardService as any,
  );

  describe('Create toyo persona training event', () => {
    test('Given valid create dto then save toyo persona training event', async () => {
      const input = new ToyoPersonaTrainingEventCreateDto({
        trainingEventId: '1',
        toyoPersonaId: '1',
        correctBlowsCombinationIds: ['1', '3', '5', '8'],
        cardReward: new CardTrainingRewardCreateDto({
          name: 'Card Reward',
          description: 'Lorem ipsum dolor sit amet.',
          cardId: '1',
          rotText: 'Lorem ipsum dolor sit amet.',
          type: '1',
          imageUrl: 'https://www.images.com/card1',
          cardCode: '23456f',
        }),
      });

      mockToyoPersonaService.getById.mockResolvedValue({
        id: input.toyoPersonaId,
      });

      for (const blowId of input.correctBlowsCombinationIds) {
        mockBlowsService.getById.mockImplementation(
          () => new TrainingBlowGetByIdDto({ id: blowId } as any),
        );
      }

      const mockId = '7a6f1652-0864-4a87-be10-dc96bcddf76b';
      const repositoryResponse = new ToyoPersonaTrainingEventModel({
        id: mockId,
        trainingEventId: input.trainingEventId,
        toyoPersonaId: input.toyoPersonaId,
        correctBlowsCombinationIds: input.correctBlowsCombinationIds,
        cardReward: new CardTrainingRewardModel({
          id: mockId,
          name: input.cardReward.name,
          description: input.cardReward.description,
          imageUrl: 'https://www.images.com/card.jpeg',
          rotText: input.cardReward.rotText,
          type: input.cardReward.type,
          cardId: input.cardReward.cardId,
          cardCode: input.cardReward.cardCode,
        }),
      });

      mockRepository.save.mockResolvedValue(repositoryResponse);

      const id = await service.create(input);

      expect(mockCardTrainingRewardService.createMetadata).toBeCalledWith(
        repositoryResponse.cardReward,
      );
      expect(mockRepository.save).toBeCalledWith({ ...input });
      expect(id).toBe(mockId);
    });

    test('Given create dto with unexisting blow then throw constraint violation error', async () => {
      const input = new ToyoPersonaTrainingEventCreateDto({
        correctBlowsCombinationIds: ['1', '2', '3'],
      } as any);

      mockBlowsService.getById.mockImplementation((blowId) => {
        if (blowId === '2') {
          throw new NotFoundError();
        }

        return new TrainingBlowGetByIdDto({ id: blowId } as any);
      });

      const t = async () => service.create(input);

      await expect(t).rejects.toThrow(ConstraintViolationError);
    });

    test('when fail to get training blow by id and error is unexpected then re-throw error', async () => {
      const input = new ToyoPersonaTrainingEventCreateDto({
        correctBlowsCombinationIds: ['1', '2', '3'],
      } as any);

      const unexpectedError = new Error();
      mockBlowsService.getById.mockRejectedValue(unexpectedError);

      const t = async () => service.create(input);

      await expect(t).rejects.toThrow(unexpectedError);
    });

    test('Given create dto with unexisting toyo persona then throw constraint violation error', async () => {
      const input = new ToyoPersonaTrainingEventCreateDto({
        toyoPersonaId: '1',
      } as any);

      mockToyoPersonaService.getById.mockRejectedValue(new NotFoundError());

      const t = async () => service.create(input);

      await expect(t).rejects.toThrow(ConstraintViolationError);
    });

    test('When fail to get toyo persona by id and error is unexpected then re-throw error', async () => {
      const input = new ToyoPersonaTrainingEventCreateDto({
        toyoPersonaId: '1',
      } as any);

      const unexpectedError = new Error();
      mockToyoPersonaService.getById.mockRejectedValue(unexpectedError);

      const t = async () => service.create(input);

      await expect(t).rejects.toThrow(unexpectedError);
    });
  });

  describe('Get current toyo persona training event', () => {
    test('Return current toyo persona training event', async () => {
      const toyoPersonaId = '1';
      const trainingEventId = '2';

      const repositoryResponse = new ToyoPersonaTrainingEventModel({
        id: '1',
        trainingEventId: trainingEventId,
        toyoPersonaId: toyoPersonaId,
        correctBlowsCombinationIds: ['1', '2', '3'],
        cardReward: new CardTrainingRewardModel({
          id: '1',
          cardId: '1',
          description: '1',
          name: 'Tatsu training event card',
          imageUrl: 'https://www.images.com/card.jpeg',
          rotText: 'Lorem impsum',
          type: '1',
        }),
      });

      const expectedResponse = new ToyoPersonaTrainingEventGetCurrentDto(
        repositoryResponse as any,
      );

      mockTrainingEventService.getCurrent.mockResolvedValue({
        id: trainingEventId,
      });

      when(mockRepository.getByTrainingEventAndPersona)
        .calledWith(trainingEventId, toyoPersonaId)
        .mockResolvedValue(repositoryResponse);

      const response = await service.getCurrent(toyoPersonaId);

      expect(response).toEqual(expectedResponse);
    });

    test('When there is no current training event then throw not found error', async () => {
      const toyoPersonaId = '1';

      mockTrainingEventService.getCurrent.mockRejectedValue(
        new NotFoundError(),
      );

      const t = async () => await service.getCurrent(toyoPersonaId);

      await expect(t).rejects.toThrow(NotFoundError);
    });

    test('When there is no current toyo persona training event then throw not found error', async () => {
      const toyoPersonaId = '1';

      mockRepository.getByTrainingEventAndPersona.mockResolvedValue(undefined);

      const t = async () => await service.getCurrent(toyoPersonaId);

      await expect(t).rejects.toThrow(NotFoundError);
    });
  });
});
