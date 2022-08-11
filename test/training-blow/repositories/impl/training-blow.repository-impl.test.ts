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
});
