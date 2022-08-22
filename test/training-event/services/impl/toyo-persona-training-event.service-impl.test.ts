import 'reflect-metadata';
import { ConstraintViolationError, NotFoundError } from 'src/errors';
import { TrainingBlowGetByIdDto } from 'src/training-blow/dto/getbyid.dto';
import {
  CardTrainingRewardCreateDto,
  ToyoPersonaTrainingEventCreateDto,
} from 'src/training-event/dto/toyo-persona-training-event/create.dto';
import { ToyoPersonaTrainingEventModel } from 'src/training-event/models/toyo-persona-training-event.model';
import { ToyoPersonaTrainingEventServiceImpl } from 'src/training-event/services/impl/toyo-persona-training-event.service-impl';

describe('Toyo persona training event service impl tests', () => {
  describe('Create toyo persona training event', () => {
    const mockRepository = {
      save: jest.fn(),
    };

    const mockBlowsService = {
      getById: jest.fn(),
    };

    const mockToyoPersonaService = {
      getById: jest.fn(),
    };

    const service = new ToyoPersonaTrainingEventServiceImpl(
      mockRepository,
      mockBlowsService as any,
      mockToyoPersonaService,
    );

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
        ...input,
      });

      mockRepository.save.mockResolvedValue(repositoryResponse);

      const id = await service.create(input);

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
});
