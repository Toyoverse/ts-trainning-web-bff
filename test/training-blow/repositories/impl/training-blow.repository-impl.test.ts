import * as Parse from 'parse/node';

import { TrainingBlowModel } from 'src/training-blow/models/training-blow.model';
import { TrainingBlowRepositoryImpl } from 'src/training-blow/repositories/impl/training-blow.repository-impl';

jest.mock('parse/node');

describe('Training blow repository tests', () => {
  const repository = new TrainingBlowRepositoryImpl();
  describe('Save training blow', () => {
    test('Given valid model then save', async () => {
      const input = new TrainingBlowModel({
        name: 'Heavy Punch',
        id: '1',
      });

      const mockParseObjectConstructor = jest.mocked(Parse.Object);

      const mockParseObject = {
        id: undefined,
        set: jest.fn(),
        save: jest.fn(),
      };

      mockParseObjectConstructor.mockReturnValue(mockParseObject as any);

      mockParseObject.set('name', input.name);
      mockParseObject.set('blowId', input.id);

      mockParseObject.save.mockResolvedValue(mockParseObject);

      const expected = new TrainingBlowModel(input);
      const output = await repository.save(input);

      expect(mockParseObject.save).toBeCalled();

      expect(output).toEqual(expected);
    });
  });

  describe('Get training blow by id', () => {
    test('Given existing id then return model', async () => {
      const id = '1';

      const expectedResponse = new TrainingBlowModel({
        id,
        name: 'Heavy Punch',
      });

      const mockParseQueryConstructor = jest.mocked(Parse.Query);

      const mockParseQuery = {
        first: jest.fn(),
        equalTo: jest.fn(),
      };

      mockParseQueryConstructor.mockReturnValue(mockParseQuery as any);

      const mockParseObject = {
        get: jest.fn(),
      };

      mockParseQuery.first.mockResolvedValue(mockParseObject);

      mockParseObject.get.mockImplementation((key) => {
        if (key === 'blowId') {
          return id;
        }
        return expectedResponse[key];
      });

      const response = await repository.getById(id);

      expect(mockParseQuery.equalTo).toBeCalledWith('blowId', id);
      expect(response).toEqual(expectedResponse);
    });

    test('Given unexisting id then return undefined', async () => {
      const id = '7a6f1652-0864-4a87-be10-dc96bcddf76b';

      const mockParseQueryConstructor = jest.mocked(Parse.Query);

      const mockParseQuery = {
        first: jest.fn(),
        equalTo: jest.fn(),
      };

      mockParseQueryConstructor.mockReturnValue(mockParseQuery as any);

      mockParseQuery.first.mockResolvedValue(undefined);

      const response = await repository.getById(id);

      expect(response).toBeUndefined();
    });
  });
});
