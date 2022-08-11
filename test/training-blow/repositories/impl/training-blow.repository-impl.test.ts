import { Query } from '@nestjs/common';
import { TrainingBlowModel } from 'src/training-blow/models/training-blow.model';
import { TrainingBlowRepositoryImpl } from 'src/training-blow/repositories/impl/training-blow.repository-impl';

const mockParseObject = {
  id: undefined,
  get: jest.fn(),
  set: jest.fn(),
  save: jest.fn(),
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

describe('Training blow repository tests', () => {
  beforeEach(() => {
    mockParseObject.id = undefined;
  });

  const repository = new TrainingBlowRepositoryImpl();
  describe('Save training blow', () => {
    test('Given valid model then save', async () => {
      const mockId = '7a6f1652-0864-4a87-be10-dc96bcddf76b';
      const input = new TrainingBlowModel({
        name: 'Heavy Punch',
        blowId: '1',
      });

      mockParseObject.set('name', input.name);
      mockParseObject.set('blowId', input.blowId);

      mockParseObject.save.mockImplementation(() => {
        mockParseObject.id = mockId;
      });

      const expected = new TrainingBlowModel({ ...input, id: mockId });
      const output = await repository.save(input);

      expect(mockParseObject.save).toBeCalled();

      expect(output).toEqual(expected);
    });
  });

  describe('Get training blow by id', () => {
    test('Given existing id then return model', async () => {
      const id = '7a6f1652-0864-4a87-be10-dc96bcddf76b';

      const expectedResponse = new TrainingBlowModel({
        id,
        name: 'Heavy Punch',
        blowId: '1',
      });

      mockParseQuery.first.mockImplementation(() => {
        mockParseObject.id = id;
        return mockParseObject;
      });

      mockParseObject.get.mockImplementation((key) => expectedResponse[key]);

      const response = await repository.getById(id);

      expect(mockParseQuery.equalTo).toBeCalledWith('objectId', id);
      expect(response).toEqual(expectedResponse);
    });

    test('Given unexisting id then return undefined', async () => {
      const id = '7a6f1652-0864-4a87-be10-dc96bcddf76b';

      mockParseQuery.first.mockResolvedValue(undefined);

      const response = await repository.getById(id);

      expect(response).toBeUndefined();
    });
  });
});
