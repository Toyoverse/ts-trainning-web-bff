import { when } from 'jest-when';
import * as Parse from 'parse/node';
import { classes } from 'src/config/back4app';
import { TrainingModel } from 'src/training/models/training.model';
import { TrainingRepositoryImpl } from 'src/training/repositories/impl/training.repository-impl';

jest.mock('parse/node');

describe('TrainingRepositoryImpl', () => {
  const repository = new TrainingRepositoryImpl();

  describe('getById', () => {
    it('should return training', async () => {
      const id = 'dfef9ef';

      const expectedResponse = new TrainingModel({
        id: id,
        playerId: 'pl3fls',
        toyoId: '1234f',
        trainingEventId: 'fk3lkls',
        startAt: new Date(2022, 2, 2, 12),
        endAt: new Date(2022, 2, 2, 16),
        claimedAt: undefined,
        combination: ['1', '3', '5'],
        isTraining: true,
        isAutomata: false,
        signature: 'flk3zx3fgdfalkfda',
      });

      const mockParseQueryConstructor = jest.mocked(Parse.Query);

      const mockParseQuery: Partial<jest.Mocked<Parse.Query>> = {
        equalTo: jest.fn(),
        first: jest.fn(),
      };

      when(mockParseQueryConstructor)
        .calledWith(classes.TOYO_TRAINING)
        .mockReturnValue(mockParseQuery as any);

      const mockParseObject = {
        id,
        get: jest.fn(),
      };

      mockParseQuery.first.mockResolvedValue(mockParseObject as any);

      when(mockParseObject.get)
        .calledWith('trainingEvent')
        .mockReturnValue({ id: expectedResponse.trainingEventId });

      when(mockParseObject.get)
        .calledWith('player')
        .mockReturnValue({ id: expectedResponse.playerId });

      when(mockParseObject.get)
        .calledWith('toyo')
        .mockReturnValue({ id: expectedResponse.toyoId });

      when(mockParseObject.get)
        .calledWith('startAt')
        .mockReturnValue(expectedResponse.startAt);

      when(mockParseObject.get)
        .calledWith('endAt')
        .mockReturnValue(expectedResponse.endAt);

      when(mockParseObject.get)
        .calledWith('claimedAt')
        .mockReturnValue(expectedResponse.claimedAt);

      when(mockParseObject.get)
        .calledWith('signature')
        .mockReturnValue(expectedResponse.signature);

      when(mockParseObject.get)
        .calledWith('combination')
        .mockReturnValue(expectedResponse.combination);

      when(mockParseObject.get)
        .calledWith('isTraining')
        .mockReturnValue(expectedResponse.isTraining);

      when(mockParseObject.get)
        .calledWith('isAutomata')
        .mockReturnValue(expectedResponse.isAutomata);

      const resp = await repository.getById(id);

      expect(mockParseQuery.equalTo).toBeCalledWith('objectId', id);
      expect(resp).toEqual(expectedResponse);
    });
  });
  describe('save', () => {
    it('should save', async () => {
      const id = 'dfef9ef';

      const trainingModel = new TrainingModel({
        id,
        playerId: '34dr32f',
        toyoId: '3473jkl',
        trainingEventId: '23fkell',
        startAt: new Date(2022, 3, 2, 2),
        endAt: new Date(2022, 3, 2, 8),
        combination: ['1', '2', '4'],
        isTraining: true,
        isAutomata: true,
      });

      const mockParseObjectConstructor = jest.mocked(Parse.Object);

      const mockTrainingParseObject = {
        id: undefined,
        set: jest.fn(),
        save: jest.fn(),
      };

      const mockTrainingEventParseObject = {
        id: trainingModel.trainingEventId,
      };

      const mockPlayerParseObject = {
        id: trainingModel.playerId,
      };

      const mockToyoParseObject = {
        id: trainingModel.toyoId,
      };

      when(mockParseObjectConstructor)
        .calledWith(classes.TRAINING_EVENT, {
          id: trainingModel.trainingEventId,
        })
        .mockReturnValue(mockTrainingEventParseObject as any);

      when(mockParseObjectConstructor)
        .calledWith(classes.TOYO, {
          id: trainingModel.toyoId,
        })
        .mockReturnValue(mockToyoParseObject as any);

      when(mockParseObjectConstructor)
        .calledWith(classes.PLAYERS, {
          id: trainingModel.playerId,
        })
        .mockReturnValue(mockPlayerParseObject as any);

      when(mockParseObjectConstructor)
        .calledWith(classes.TOYO_TRAINING)
        .mockReturnValue(mockTrainingParseObject as any);

      mockTrainingParseObject.save.mockImplementation(
        () => mockTrainingParseObject,
      );

      const response = await repository.save(trainingModel);

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'trainingEvent',
        mockTrainingEventParseObject,
      );

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'toyo',
        mockToyoParseObject,
      );

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'player',
        mockPlayerParseObject,
      );

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'startAt',
        trainingModel.startAt,
      );

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'endAt',
        trainingModel.endAt,
      );

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'combination',
        trainingModel.combination,
      );

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'isTraining',
        trainingModel.isTraining,
      );

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'isAutomata',
        trainingModel.isAutomata,
      );

      expect(response).toEqual(trainingModel);
    });
  });
});
