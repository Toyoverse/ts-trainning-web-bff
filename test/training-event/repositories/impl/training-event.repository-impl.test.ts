import * as Parse from 'parse/node';
import { when } from 'jest-when';
import {
  BlowConfigModel,
  TrainingEventModel,
} from 'src/training-event/models/training-event.model';
import { TrainingEventRepositoryImpl } from 'src/training-event/repositories/impl/training-event.repository-impl';
import { classes } from 'src/config/back4app';

jest.useFakeTimers().setSystemTime(new Date('2022-08-09'));

jest.mock('parse/node');

describe('Training event repository tests', () => {
  const repository = new TrainingEventRepositoryImpl();

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

      const mockTrainingEventParseObject = {
        id: undefined,
        set: jest.fn(),
        relation: jest.fn(),
        save: jest.fn(),
      };

      when(mockParseObjectConstructor)
        .calledWith(classes.TRAINING_EVENT)
        .mockReturnValue(mockTrainingEventParseObject as unknown as any);

      mockTrainingEventParseObject.save.mockImplementation(() => {
        mockTrainingEventParseObject.id = id;
        return mockTrainingEventParseObject;
      });

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

      expect(mockTrainingEventParseObject.set).toBeCalledWith(
        'blows',
        input.blows,
      );
      expect(mockTrainingEventParseObject.set).toBeCalledWith(
        'blowsConfig',
        input.blowsConfig,
      );

      expect(mockTrainingEventParseObject.save).toBeCalled();

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
        bondReward: 0.75,
        bonusBondReward: 1.25,
        isOngoing: false,
        toyoTrainingConfirmationMessage:
          'Are you sure you want to start training?',
        inTrainingMessage: 'Training Doge',
        losesMessage: 'Sorry, you lost',
        rewardMessage: 'You won, congratulations',
        blows: ['1', '2'],
        blowsConfig: [
          new BlowConfigModel({ duration: 3, qty: 5 }),
          new BlowConfigModel({ duration: 4, qty: 6 }),
        ],
      });

      const mockParseQueryConstructor = jest.mocked(Parse.Query);

      const mockTrainingEventParseObject = {
        id: undefined,
        get: jest.fn(),
      };

      const mockTrainingEventParseQuery = {
        equalTo: jest.fn(),
        lessThanOrEqualTo: jest.fn(),
        greaterThan: jest.fn(),
        first: jest.fn(),
      };

      when(mockParseQueryConstructor)
        .calledWith(classes.TRAINING_EVENT)
        .mockReturnValue(mockTrainingEventParseQuery as unknown as any);

      mockTrainingEventParseObject.id = id;
      mockTrainingEventParseObject.get.mockImplementation(
        (key) => expectedModel[key],
      );

      mockTrainingEventParseQuery.first.mockResolvedValue(
        mockTrainingEventParseObject,
      );

      const model = await repository.getCurrent();

      expect(mockTrainingEventParseQuery.equalTo).toBeCalledWith(
        'isOngoing',
        true,
      );
      expect(mockTrainingEventParseQuery.lessThanOrEqualTo).toBeCalledWith(
        'startAt',
        now,
      );
      expect(mockTrainingEventParseQuery.greaterThan).toBeCalledWith(
        'endAt',
        now,
      );

      expect(model).toEqual(expectedModel);
    });

    test('when get current training event and there is no current training event then return undefined', async () => {
      const mockParseQueryConstructor = jest.mocked(Parse.Query);

      const mockTrainingEventParseQuery = {
        equalTo: jest.fn(),
        lessThanOrEqualTo: jest.fn(),
        greaterThan: jest.fn(),
        first: jest.fn(),
      };

      when(mockParseQueryConstructor)
        .calledWith(classes.TRAINING_EVENT)
        .mockReturnValue(mockTrainingEventParseQuery as unknown as any);

      mockTrainingEventParseQuery.first.mockResolvedValue(undefined);
      const model = await repository.getCurrent();
      expect(model).toEqual(undefined);
    });
  });

  describe('isDatesConflicting', () => {
    test('Returns false when dates conflicts', async () => {
      const startDate = new Date(2022, 2, 2);
      const endDate = new Date(2022, 2, 9);

      const mockParseQueryConstructor = jest.mocked(Parse.Query);
      const mockParseQueryOrConstructor = jest.mocked(Parse.Query.or);

      const mockParseQuery = {
        count: jest.fn(),
      };

      const mockStartDateInAnotherEventPeriodQuery = {
        lessThanOrEqualTo: jest.fn(),
        greaterThanOrEqualTo: jest.fn(),
      };
      const mockEndDateInAnotherEventPeriodQuery = {
        lessThanOrEqualTo: jest.fn(),
        greaterThanOrEqualTo: jest.fn(),
      };

      const mockWrapsAnotherEventPeriodQuery = {
        lessThanOrEqualTo: jest.fn(),
        greaterThanOrEqualTo: jest.fn(),
      };

      mockParseQueryConstructor.mockReturnValueOnce(
        mockStartDateInAnotherEventPeriodQuery as any,
      );
      mockParseQueryConstructor.mockReturnValueOnce(
        mockEndDateInAnotherEventPeriodQuery as any,
      );
      mockParseQueryConstructor.mockReturnValueOnce(
        mockWrapsAnotherEventPeriodQuery as any,
      );

      mockParseQueryOrConstructor.mockReturnValue(mockParseQuery as any);

      mockParseQuery.count.mockResolvedValue(1);

      const result = await repository.isDatesConflicting(startDate, endDate);

      expect(
        mockStartDateInAnotherEventPeriodQuery.lessThanOrEqualTo,
      ).toBeCalledWith('startAt', startDate);

      expect(
        mockStartDateInAnotherEventPeriodQuery.greaterThanOrEqualTo,
      ).toBeCalledWith('endAt', startDate);

      expect(
        mockEndDateInAnotherEventPeriodQuery.lessThanOrEqualTo,
      ).toBeCalledWith('startAt', endDate);

      expect(
        mockEndDateInAnotherEventPeriodQuery.greaterThanOrEqualTo,
      ).toBeCalledWith('endAt', endDate);

      expect(
        mockWrapsAnotherEventPeriodQuery.greaterThanOrEqualTo,
      ).toBeCalledWith('startAt', startDate);

      expect(mockWrapsAnotherEventPeriodQuery.lessThanOrEqualTo).toBeCalledWith(
        'endAt',
        endDate,
      );

      expect(mockParseQueryOrConstructor).toBeCalledWith(
        mockStartDateInAnotherEventPeriodQuery,
        mockEndDateInAnotherEventPeriodQuery,
        mockWrapsAnotherEventPeriodQuery,
      );
      expect(result).toBeTruthy();
    });
  });
});
