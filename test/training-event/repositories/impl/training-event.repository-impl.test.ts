import * as Parse from 'parse/node';
import { when } from 'jest-when';
import {
  BlowConfigModel,
  TrainingEventModel,
} from 'src/training-event/models/training-event.model';
import { TrainingEventRepositoryImpl } from 'src/training-event/repositories/impl/training-event.repository-impl';
import { classes } from 'src/config/back4app';
import { ConstraintViolationError } from 'src/errors/constraint-violation.error';

jest.useFakeTimers().setSystemTime(new Date('2022-08-09'));

const mockParseObject = {
  id: undefined,
  get: jest.fn(),
  set: jest.fn(),
  save: jest.fn(),
  relation: jest.fn(),
};
const mockParseQuery = {
  first: jest.fn(),
  equalTo: jest.fn(),
  lessThanOrEqualTo: jest.fn(),
  greaterThan: jest.fn(),
};

jest.mock('parse/node', () => {
  return {
    Object: jest.fn(),
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
        bondReward: 0.75,
        bonusBondReward: 1.25,
        isOngoing: false,
        toyoTrainingConfirmationMessage:
          'Are you sure you want to start training?',
        inTrainingMessage: 'Training Doge',
        losesMessage: 'Sorry, you lost',
        rewardMessage: 'You won, congratulations',
        blows: ['1', '2', '3'],
        blowsConfig: [
          new BlowConfigModel({ duration: 3, qty: 5 }),
          new BlowConfigModel({ duration: 4, qty: 6 }),
        ],
      });

      const mockParseObjectConstructor = jest.mocked(Parse.Object);
      const mockParseQueryConstructor = jest.mocked(Parse.Query);

      const mockTrainingEventParseObject = {
        id: undefined,
        set: jest.fn(),
        relation: jest.fn(),
        save: jest.fn(),
      };

      const mockTrainingBlowParseQuery = {
        equalTo: jest.fn(),
        first: jest.fn(),
      };

      when(mockParseObjectConstructor)
        .calledWith(classes.TRAINING_EVENT)
        .mockReturnValue(mockTrainingEventParseObject as unknown as any);

      when(mockParseQueryConstructor)
        .calledWith(classes.TRAINING_BLOW)
        .mockReturnValue(mockTrainingBlowParseQuery as unknown as any);

      for (const blowId of input.blows) {
        mockTrainingBlowParseQuery.first.mockImplementationOnce(() => {
          return { id: blowId };
        });
      }

      mockTrainingEventParseObject.save.mockImplementation(() => {
        mockTrainingEventParseObject.id = id;
        return mockTrainingEventParseObject;
      });

      const mockTrainingBlowsRelation = {
        add: jest.fn(),
      };

      when(mockTrainingEventParseObject.relation).mockReturnValue(
        mockTrainingBlowsRelation,
      );

      const response = await repository.save(input);

      expect(mockTrainingEventParseObject.set).toBeCalledWith(
        'name',
        input.name,
      );
      expect(mockTrainingEventParseObject.set).toBeCalledWith(
        'startAt',
        input.startAt,
      );
      expect(mockTrainingEventParseObject.set).toBeCalledWith(
        'endAt',
        input.endAt,
      );
      expect(mockTrainingEventParseObject.set).toBeCalledWith(
        'bondReward',
        input.bondReward,
      );
      expect(mockTrainingEventParseObject.set).toBeCalledWith(
        'bonusBondReward',
        input.bonusBondReward,
      );
      expect(mockTrainingEventParseObject.set).toBeCalledWith(
        'isOngoing',
        input.isOngoing,
      );
      expect(mockTrainingEventParseObject.set).toBeCalledWith(
        'inTrainingMessage',
        input.inTrainingMessage,
      );
      expect(mockTrainingEventParseObject.set).toBeCalledWith(
        'losesMessage',
        input.losesMessage,
      );
      expect(mockTrainingEventParseObject.set).toBeCalledWith(
        'rewardMessage',
        input.rewardMessage,
      );

      for (const blowId of input.blows) {
        expect(mockTrainingBlowParseQuery.equalTo).toBeCalledWith(
          'objectId',
          blowId,
        );

        expect(mockTrainingBlowsRelation.add).toBeCalledWith({ id: blowId });
      }

      expect(mockTrainingEventParseObject.set).toBeCalledWith(
        'blowsConfig',
        input.blowsConfig,
      );

      expect(mockTrainingEventParseObject.save).toBeCalled();

      expect(response).toEqual({ id, ...input });
    });

    test('Given unexisting blow then throw exception', async () => {
      const now = new Date();

      const input = new TrainingEventModel({
        name: 'Training Event',
        startAt: now,
        endAt: now,
        story:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod ante a ante sagittis ultricies.',
        bondReward: 0.75,
        bonusBondReward: 1.25,
        isOngoing: false,
        toyoTrainingConfirmationMessage:
          'Are you sure you want to start training?',
        inTrainingMessage: 'Training Doge',
        losesMessage: 'Sorry, you lost',
        rewardMessage: 'You won, congratulations',
        blows: ['1', '2', '3'],
        blowsConfig: [
          new BlowConfigModel({ duration: 3, qty: 5 }),
          new BlowConfigModel({ duration: 4, qty: 6 }),
        ],
      });

      const mockTrainingEventParseObject = {
        id: undefined,
        set: jest.fn(),
        relation: jest.fn(),
        save: jest.fn(),
      };

      const mockParseObjectConstructor = jest.mocked(Parse.Object);
      const mockParseQueryConstructor = jest.mocked(Parse.Query);

      when(mockParseObjectConstructor)
        .calledWith(classes.TRAINING_EVENT)
        .mockReturnValue(mockTrainingEventParseObject as unknown as any);

      const mockTrainingBlowParseQuery = {
        equalTo: jest.fn(),
        first: jest.fn(),
      };

      when(mockParseObjectConstructor)
        .calledWith(classes.TRAINING_EVENT)
        .mockReturnValue(mockTrainingEventParseObject as unknown as any);

      when(mockParseQueryConstructor)
        .calledWith(classes.TRAINING_BLOW)
        .mockReturnValue(mockTrainingBlowParseQuery as unknown as any);

      mockParseQuery.first.mockResolvedValue(undefined);

      const mockTrainingBlowsRelation = {
        add: jest.fn().mockImplementation(),
      };

      when(mockTrainingEventParseObject.relation).mockReturnValue(
        mockTrainingBlowsRelation,
      );

      const t = async () => await repository.save(input);
      await expect(t).rejects.toThrow(ConstraintViolationError);
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
        bondReward: 0.75,
        bonusBondReward: 0,
        isOngoing: false,
        toyoTrainingConfirmationMessage:
          'Are you sure you want to start training?',
        inTrainingMessage: 'Training Doge',
        losesMessage: 'Sorry, you lost',
        rewardMessage: 'You won, congratulations',
        blows: [],
        blowsConfig: [],
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
