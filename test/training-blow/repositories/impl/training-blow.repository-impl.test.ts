import { TrainingBlowModel } from 'src/training-blow/models/training-blow.model';
import { TrainingBlowRepositoryImpl } from 'src/training-blow/repositories/impl/training-blow.repository-impl';

const mockParseObject = {
  id: undefined,
  set: jest.fn(),
  save: jest.fn(),
};

jest.mock('parse/node', () => {
  return {
    Object: jest.fn().mockImplementation(() => mockParseObject),
  };
});

describe('Training blow repository tests', () => {
  beforeEach(() => {
    mockParseObject.id = undefined;
  });

  const repository = new TrainingBlowRepositoryImpl();
  describe('Save training blow', () => {
    test('Given valid model then save', async () => {
      const input = new TrainingBlowModel({
        name: 'Heavy Punch',
        id: '1',
      });

      mockParseObject.set('name', input.name);
      mockParseObject.set('blowId', input.id);

      mockParseObject.save.mockResolvedValue(mockParseObject);

      const expected = new TrainingBlowModel(input);
      const output = await repository.save(input);

      expect(mockParseObject.save).toBeCalled();

      expect(output).toEqual(expected);
    });
  });
});
