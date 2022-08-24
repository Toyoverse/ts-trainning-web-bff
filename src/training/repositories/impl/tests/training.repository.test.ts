import { TrainingStartDto } from '../../../../training/dto/start.dto';
import { TrainingModel } from '../../../../training/models/training.model';
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

const now = new Date();
const endAt = new Date(Date.now() + 8 * (60 * 60 * 1000));

describe('Training repository tests', () => {
  const repository = new TrainingRepositoryImpl();

  describe('start', () => {
    test('should return success', async () => {
      const input = new TrainingStartDto({
        playerId: 'SJhHPvzbw7',
        combination: ['3', '2', '1'],
        toyoId: 'tkWoczXeYJ',
        trainingId: 'hWefhSbzF5',
      });

      const expectedData = new TrainingModel({
        startAt: now,
        signature: undefined,
        endAt: endAt,
        claimedAt: undefined,
        combination: ['3', '2', '1'],
        toyo: 'tkWoczXeYJ',
        training: 'hWefhSbzF5',
      });

      mockParseObject.save.mockImplementation(() => {
        return mockParseObject;
      });

      const resp = await repository.start(input);

      expect(mockParseObject.save).toBeCalled();

      expect(resp).toEqual(expectedData);
    });
  });

  describe('close', () => {
    test('should return success', async () => {
      const trainingId = 'SP4GwD8VmU';

      const expectedData = new TrainingModel({
        startAt: now,
        signature:
          '0x59ef7b920e9d56855a14241711bb22b2468d558daa89b566f505aae31ad2e8177713886b93305dd19bb340aed7bfcd4bf085a10827c445fe5675165b9b0b8af11c',
        endAt: endAt,
        claimedAt: now,
        combination: ['3', '2', '1'],
        toyo: 'tkWoczXeYJ',
        training: 'hWefhSbzF5',
      });

      mockParseObject.save.mockImplementation(() => {
        return mockParseObject;
      });

      const resp = await repository.close(trainingId);

      expect(mockParseObject.save).toBeCalled();

      expect(resp).toEqual(expectedData);
    });
  });

  describe('list', () => {
    test('should return success', async () => {
      const playerId = 'SJhHPvzbw7';

      const expectedData: TrainingModel[] = [
        {
          startAt: now,
          signature:
            '0x59ef7b920e9d56855a14241711bb22b2468d558daa89b566f505aae31ad2e8177713886b93305dd19bb340aed7bfcd4bf085a10827c445fe5675165b9b0b8af11c',
          endAt: endAt,
          claimedAt: now,
          combination: ['3', '2', '1'],
          toyo: 'tkWoczXeYJ',
          training: 'hWefhSbzF5',
        },
      ];

      mockParseObject.list.mockImplementation(() => {
        return mockParseObject;
      });

      const resp = await repository.list(playerId);

      expect(mockParseObject.list).toBeCalled();

      expect(resp).toEqual(expectedData);
    });
  });
});
