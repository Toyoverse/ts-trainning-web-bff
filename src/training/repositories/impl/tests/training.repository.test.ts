import { TrainingModel } from 'src/training/models/training.model';
import { TrainingRepositoryImpl } from '../training.repository-impl';

const mockParseObject = {
  get: jest.fn(),
  set: jest.fn(),
  save: jest.fn(),
  list: jest.fn(),
};

const mockParseQuery = {
  first: jest.fn(),
  equalTo: jest.fn(),
  lessThanOrEqualTo: jest.fn(),
  greaterThan: jest.fn(),
};

jest.mock('parse/node', () => {
  return {
    Object: jest.fn().mockImplementation(() => mockParseObject),
    Query: jest.fn().mockImplementation(() => mockParseQuery),
  };
});

describe('Training repository tests', () => {
  const repository = new TrainingRepositoryImpl();

  describe('start', () => {
    test('should return success', async () => {
      const input = new TrainingModel({
        playerId: 'SJhHPvzbw7',
        sequence: ['3', '2', '1'],
        toyoId: 'tkWoczXeYJ',
        trainingId: 'hWefhSbzF5',
      });

      mockParseObject.save.mockImplementation(() => {
        return mockParseObject;
      });

      const resp = await repository.start(input);

      expect(mockParseObject.save).toBeCalled();

      expect(resp).toEqual(input);
    });
  });

  describe('close', () => {
    test('should return success', async () => {
      const trainingId = 'SP4GwD8VmU';

      const responseObj = new TrainingModel({
        playerId: 'SJhHPvzbw7',
        sequence: ['3', '2', '1'],
        toyoId: 'tkWoczXeYJ',
        trainingId: 'hWefhSbzF5',
      });

      mockParseObject.save.mockImplementation(() => {
        return mockParseObject;
      });

      const resp = await repository.close(trainingId);

      expect(mockParseObject.save).toBeCalled();

      expect(resp).toEqual(responseObj);
    });
  });

  describe('list', () => {
    test('should return success', async () => {
      const respArr = [];

      mockParseObject.list.mockImplementation(() => {
        return [];
      });

      const resp = await repository.list();

      expect(mockParseObject.list).toBeCalled();

      expect(resp).toEqual(respArr);
    });
  });
});
