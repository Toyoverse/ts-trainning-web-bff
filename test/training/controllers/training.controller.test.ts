import 'reflect-metadata';
import { TrainingController } from 'src/training/controllers/training.controller';
import { TrainingStartDto } from 'src/training/dto/start.dto';

describe('Training controller tests', () => {
  const trainingService = {
    start: jest.fn(),
    close: jest.fn(),
    list: jest.fn(),
  };

  const trainingController = new TrainingController(trainingService);

  describe('Start training', () => {
    test('should return success', async () => {
      const dto = new TrainingStartDto({
        playerId: 'SJhHPvzbw7',
        combination: ['3', '2', '1'],
        toyoId: 'tkWoczXeYJ',
        trainingId: 'hWefhSbzF5',
      });

      await trainingController.start(dto);

      expect(trainingService.start).toBeCalled();
    });
  });

  describe('Close training', () => {
    test('should return success', async () => {
      const trainingId = 'SP4GwD8VmU';

      await trainingController.close(trainingId);

      expect(trainingService.close).toBeCalled();
    });
  });

  describe('List trainings', () => {
    test('should return success', async () => {
      const playerId = 'SJhHPvzbw7';

      await trainingController.list(playerId);

      expect(trainingService.list).toBeCalled();
    });
  });
});
