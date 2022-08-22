import 'reflect-metadata';
import { TrainingStartDto } from 'src/training/dto/start.dto';
import { TrainingModel } from 'src/training/models/training.model';
import { TrainingServiceImpl } from '../training.service-impl';

describe('Training service tests', () => {
  const trainingRepository = {
    start: jest.fn(),
    close: jest.fn(),
    list: jest.fn(),
  };

  const trainingService = new TrainingServiceImpl(trainingRepository);

  describe('start', () => {
    test('should return success', async () => {
      const dto = new TrainingStartDto({
        playerId: 'SJhHPvzbw7',
        sequence: ['3', '2', '1'],
        toyoId: 'tkWoczXeYJ',
        trainingId: 'hWefhSbzF5',
      });

      const expectedData = new TrainingModel(dto);

      const repositoryResponse = new TrainingModel(dto);

      trainingRepository.start.mockResolvedValue(repositoryResponse);

      const resp = await trainingService.start(dto);

      expect(trainingRepository.start).toBeCalledWith(expectedData);

      expect(repositoryResponse).toEqual(resp);
    });
  });

  describe('close', () => {
    test('should return success', async () => {
      const trainingId = 'SP4GwD8VmU';

      const repositoryResponse = new TrainingModel({
        playerId: 'SJhHPvzbw7',
        sequence: ['3', '2', '1'],
        toyoId: 'tkWoczXeYJ',
        trainingId: 'hWefhSbzF5',
      });

      trainingRepository.close.mockResolvedValue(repositoryResponse);

      const resp = await trainingService.close(trainingId);

      expect(repositoryResponse).toEqual(resp);
    });
  });

  describe('list', () => {
    test('should return success', async () => {
      const repositoryResponse = [];

      trainingRepository.list.mockResolvedValue(repositoryResponse);

      const resp = await trainingService.list();

      expect(repositoryResponse).toEqual(resp);
    });
  });
});
