import { TrainingEventModel } from 'src/training-event/models/training-event.model';
import { TrainingEventRepositoryImpl } from 'src/training-event/repositories/impl/training-event.repository-impl';

jest.useFakeTimers().setSystemTime(new Date('2022-08-09'));

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

describe('Training event repository tests', () => {
  const repository = new TrainingEventRepositoryImpl();

  beforeEach(() => {
    mockParseObject.id = undefined;
  });
  describe('Save training events', () => {
    test('Given valid model when save then save', async () => {
      const id = '7a6f1652-0864-4a87-be10-dc96bcddf76b';
      const now = new Date();

      const input = new TrainingEventModel({
        name: 'Training Event',
        startAt: now,
        endAt: now,
        story:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod ante a ante sagittis ultricies.',
        bondReward: 100,
        isOngoing: false,
        toyoTrainingConfirmationMessage:
          'Are you sure you want to start training?',
        inTrainingMessage: 'Training Doge',
        losesMessage: 'Sorry, you lost',
        rewardMessage: 'You won, congratulations',
      });

      mockParseObject.save.mockImplementation(() => {
        mockParseObject.id = id;
        return mockParseObject;
      });

      const response = await repository.save(input);

      expect(mockParseObject.set).toBeCalledWith('name', input.name);
      expect(mockParseObject.set).toBeCalledWith('startAt', input.startAt);
      expect(mockParseObject.set).toBeCalledWith('endAt', input.endAt);
      expect(mockParseObject.set).toBeCalledWith(
        'bondReward',
        input.bondReward,
      );
      expect(mockParseObject.set).toBeCalledWith('isOngoing', input.isOngoing);
      expect(mockParseObject.set).toBeCalledWith(
        'inTrainingMessage',
        input.inTrainingMessage,
      );
      expect(mockParseObject.set).toBeCalledWith(
        'losesMessage',
        input.losesMessage,
      );
      expect(mockParseObject.set).toBeCalledWith(
        'rewardMessage',
        input.rewardMessage,
      );

      expect(mockParseObject.save).toBeCalled();

      expect(response).toEqual({ id, ...input });
    });
  });

  describe('Get current training event', () => {
    test('when get current training event then return current training event', async () => {
      const id = '7a6f1652-0864-4a87-be10-dc96bcddf76b';
      const now = new Date();

      const expectedModel = new TrainingEventModel({
        id,
        name: 'Training Event',
        startAt: now,
        endAt: now,
        story:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod ante a ante sagittis ultricies.',
        bondReward: 100,
        isOngoing: false,
        toyoTrainingConfirmationMessage:
          'Are you sure you want to start training?',
        inTrainingMessage: 'Training Doge',
        losesMessage: 'Sorry, you lost',
        rewardMessage: 'You won, congratulations',
      });

      mockParseObject.id = id;
      mockParseObject.get.mockImplementation((key) => expectedModel[key]);

      mockParseQuery.first.mockResolvedValue(mockParseObject);

      const model = await repository.getCurrent();

      expect(mockParseQuery.equalTo).toBeCalledWith('isOngoing', true);
      expect(mockParseQuery.lessThanOrEqualTo).toBeCalledWith('startAt', now);
      expect(mockParseQuery.greaterThan).toBeCalledWith('endAt', now);

      expect(model).toEqual(expectedModel);
    });
    test('when get current training event and there is no current training event then return undefined', async () => {
      mockParseQuery.first.mockResolvedValue(undefined);
      const model = await repository.getCurrent();
      expect(model).toEqual(undefined);
    });
  });
});
