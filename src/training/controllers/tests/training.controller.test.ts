import 'reflect-metadata';
import { TrainingController } from '../training.controller';
import { TrainingStartDto } from '../../dto/start.dto';

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
        sequence: ['3', '2', '1'],
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
      await trainingController.list();

      expect(trainingService.list).toBeCalled();
    });
  });
});
