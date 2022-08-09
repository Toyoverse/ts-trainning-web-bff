import { TrainingEventModel } from 'src/training-event/models/training-event.model';
import { TrainingEventRepositoryImpl } from '../training-event.repository';

const mockParser = {
  id: undefined,
  set: jest.fn(),
  save: jest.fn(),
};

jest.mock('parse/node', () => {
  return {
    Object: jest.fn().mockImplementation(() => mockParser),
  };
});

describe('Training event repository tests', () => {
  describe('Save training events', () => {
    const repository = new TrainingEventRepositoryImpl();

    test('Given valid model when save then save', async () => {
      const id = '7a6f1652-0864-4a87-be10-dc96bcddf76b';
      const now = new Date();

      const input = new TrainingEventModel({
        name: 'Training Event',
        startAt: now,
        endAt: now,
        bondReward: 100,
        isOngoing: false,
        inTrainingMessage: 'Training Doge',
        losesMessage: 'Sorry, you lost',
        rewardMessage: 'You won, congratulations',
      });

      mockParser.save.mockImplementation(() => {
        mockParser.id = id;
        return mockParser;
      });

      const response = await repository.save(input);

      expect(mockParser.set).toBeCalledWith('name', input.name);
      expect(mockParser.set).toBeCalledWith('startAt', input.startAt);
      expect(mockParser.set).toBeCalledWith('endAt', input.endAt);
      expect(mockParser.set).toBeCalledWith('bondReward', input.bondReward);
      expect(mockParser.set).toBeCalledWith('isOngoing', input.isOngoing);
      expect(mockParser.set).toBeCalledWith(
        'inTrainingMessage',
        input.inTrainingMessage,
      );
      expect(mockParser.set).toBeCalledWith('losesMessage', input.losesMessage);
      expect(mockParser.set).toBeCalledWith(
        'rewardMessage',
        input.rewardMessage,
      );

      expect(mockParser.save).toBeCalled();

      expect(response).toEqual({ id, ...input });
    });
  });
});
