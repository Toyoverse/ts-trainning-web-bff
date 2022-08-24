import 'reflect-metadata';
import { TrainingStartDto } from '../../../../training/dto/start.dto';
import { TrainingModel } from '../../../../training/models/training.model';
import { TrainingServiceImpl } from '../training.service-impl';

describe('Training service tests', () => {
  const trainingRepository = {
    start: jest.fn(),
    close: jest.fn(),
    list: jest.fn(),
  };

  const trainingService = new TrainingServiceImpl(trainingRepository);
  const now = new Date();
  const endAt = new Date(Date.now() + 8 * (60 * 60 * 1000));

  describe('start', () => {
    test('should return success', async () => {
      const dto = new TrainingStartDto({
        playerId: 'SJhHPvzbw7',
        combination: ['3', '2', '1'],
        toyoId: 'tkWoczXeYJ',
        trainingId: 'hWefhSbzF5',
      });

      const repositoryResponse = new TrainingModel({
        startAt: now,
        signature: undefined,
        endAt: endAt,
        claimedAt: undefined,
        combination: ['3', '2', '1'],
        toyo: 'tkWoczXeYJ',
        training: 'hWefhSbzF5',
      });

      trainingRepository.start.mockResolvedValue(repositoryResponse);

      const resp = await trainingService.start(dto);

      expect(trainingRepository.start).toBeCalledWith(dto);

      expect(resp).toEqual(repositoryResponse);
    });
  });

  describe('close', () => {
    test('should return success', async () => {
      const trainingId = 'SP4GwD8VmU';

      const repositoryResponse = new TrainingModel({
        startAt: now,
        signature:
          '0x59ef7b920e9d56855a14241711bb22b2468d558daa89b566f505aae31ad2e8177713886b93305dd19bb340aed7bfcd4bf085a10827c445fe5675165b9b0b8af11c',
        endAt: endAt,
        claimedAt: now,
        combination: ['3', '2', '1'],
        toyo: 'tkWoczXeYJ',
        training: 'hWefhSbzF5',
      });

      trainingRepository.close.mockResolvedValue(repositoryResponse);

      const resp = await trainingService.close(trainingId);

      expect(repositoryResponse).toEqual(resp);
    });
  });

  describe('list', () => {
    test('should return success', async () => {
      const playerId = 'SJhHPvzbw7';

      const repositoryResponse = [
        {
          startAt: now,
          signature: undefined,
          endAt: endAt,
          claimedAt: undefined,
          combination: ['3', '2', '1'],
          toyoId: 'tkWoczXeYJ',
          trainingId: 'hWefhSbzF5',
        },
      ];

      trainingRepository.list.mockResolvedValue(repositoryResponse);

      const resp = await trainingService.list(playerId);

      expect(repositoryResponse).toEqual(resp);
    });
  });
});
