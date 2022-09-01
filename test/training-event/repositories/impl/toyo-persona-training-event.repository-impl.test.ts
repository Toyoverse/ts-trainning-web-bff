import { when } from 'jest-when';
import * as Parse from 'parse/node';
import { classes } from 'src/config/back4app';
import { ConstraintViolationError } from 'src/errors';
import { CardTrainingRewardModel } from 'src/training-event/models/card-training-reward.model';
import { ToyoPersonaTrainingEventModel } from 'src/training-event/models/toyo-persona-training-event.model';
import { ToyoPersonaTrainingEventRepositoryImpl } from 'src/training-event/repositories/impl/toyo-persona-training-event.repository-impl';

jest.mock('parse/node');

describe('Toyo persona training event repository tests', () => {
  const repository = new ToyoPersonaTrainingEventRepositoryImpl();
  describe('Save toyo persona training event', () => {
    test('Given valid model then save', async () => {
      const input = new ToyoPersonaTrainingEventModel({
        trainingEventId: '1',
        toyoPersonaId: '1',
        correctBlowsCombinationIds: ['1', '3', '5', '8'],
        cardReward: new CardTrainingRewardModel({
          name: 'Card Reward',
          description: 'Lorem ipsum dolor sit amet.',
          imageUrl: 'https://www.images.com/card.jpeg',
          cardId: '1',
          rotText: 'Lorem ipsum dolor sit amet.',
          type: '1',
        }),
      });

      const mockId = '7a6f1652-0864-4a87-be10-dc96bcddf76b';

      const parseObjectConstructor = jest.mocked(Parse.Object);
      const parseQueryConstructor = jest.mocked(Parse.Query);

      const mockToyoPersonaTrainingEventParseObject = {
        id: undefined,
        relation: jest.fn(),
        set: jest.fn(),
        save: jest.fn(),
      };

      const mockCardRewardParseObject = {
        id: undefined,
        set: jest.fn(),
        save: jest.fn(),
        toPointer: () => {
          return mockCardRewardParseObject.id;
        },
      };

      const mockTrainingEventParseQuery = {
        equalTo: jest.fn(),
        first: jest.fn(),
      };

      const mockTrainingEventParseObject = {
        id: input.trainingEventId,
        toPointer: () => {
          return mockCardRewardParseObject.id;
        },
      };

      when(parseObjectConstructor)
        .calledWith(classes.TOYO_PERSONA_TRAINING_EVENT)
        .mockReturnValue(mockToyoPersonaTrainingEventParseObject as any);

      when(parseObjectConstructor)
        .calledWith(classes.CARD_TRAINING_REWARD)
        .mockReturnValue(mockCardRewardParseObject as any);

      when(parseQueryConstructor)
        .calledWith(classes.TRAINING_EVENT)
        .mockReturnValue(mockTrainingEventParseQuery as any);

      mockToyoPersonaTrainingEventParseObject.save.mockImplementation(() => {
        mockToyoPersonaTrainingEventParseObject.id = mockId;
        return mockToyoPersonaTrainingEventParseObject;
      });

      mockCardRewardParseObject.save.mockImplementation(() => {
        mockCardRewardParseObject.id = mockId;
        return mockCardRewardParseObject;
      });

      mockTrainingEventParseQuery.first.mockResolvedValue(
        mockTrainingEventParseObject,
      );

      const expectedResponse = new ToyoPersonaTrainingEventModel({
        ...input,
        id: mockId,
      });

      const response = await repository.save(input);

      expect(mockTrainingEventParseQuery.equalTo).toBeCalledWith(
        'objectId',
        input.trainingEventId,
      );

      expect(mockCardRewardParseObject.set).toBeCalledWith(
        'name',
        input.cardReward.name,
      );

      expect(mockCardRewardParseObject.set).toBeCalledWith(
        'description',
        input.cardReward.description,
      );
      expect(mockCardRewardParseObject.set).toBeCalledWith(
        'imageUrl',
        input.cardReward.imageUrl,
      );

      expect(mockCardRewardParseObject.set).toBeCalledWith(
        'rotText',
        input.cardReward.rotText,
      );

      expect(mockCardRewardParseObject.set).toBeCalledWith(
        'type',
        input.cardReward.type,
      );

      expect(mockCardRewardParseObject.set).toBeCalledWith(
        'cardId',
        input.cardReward.cardId,
      );

      expect(mockCardRewardParseObject.save).toBeCalled();

      expect(mockToyoPersonaTrainingEventParseObject.set).toBeCalledWith(
        'trainingEvent',
        mockTrainingEventParseObject.toPointer(),
      );
      expect(mockToyoPersonaTrainingEventParseObject.set).toBeCalledWith(
        'toyoPersona',
        input.toyoPersonaId,
      );
      expect(mockToyoPersonaTrainingEventParseObject.set).toBeCalledWith(
        'correctBlowsCombination',
        input.correctBlowsCombinationIds,
      );
      expect(mockToyoPersonaTrainingEventParseObject.set).toBeCalledWith(
        'cardReward',
        mockCardRewardParseObject.toPointer(),
      );

      expect(mockToyoPersonaTrainingEventParseObject.save).toBeCalled();
      expect(response).toEqual(expectedResponse);
    });

    test('Given model with unexisting training event then throw constraint violation error', async () => {
      const input = new ToyoPersonaTrainingEventModel({
        trainingEventId: '1',
      } as any);

      const parseQueryConstructor = jest.mocked(Parse.Query);

      when(parseQueryConstructor)
        .calledWith(classes.TRAINING_EVENT)
        .mockReturnValue(undefined);

      const t = repository.save(input);

      await expect(t).rejects.toThrow(ConstraintViolationError);
    });
  });

  describe('Get toyo persona training event by training event and toyo persona', () => {
    test('When there is a toyo persona training event then return it', async () => {
      const toyoPersonaId = '1';
      const trainingEventId = '1';

      const expectedResponse = new ToyoPersonaTrainingEventModel({
        id: '1',
        toyoPersonaId: toyoPersonaId,
        trainingEventId: trainingEventId,
        correctBlowsCombinationIds: ['1', '2'],
        cardReward: new CardTrainingRewardModel({
          id: '1',
          name: 'Event card',
          cardId: '1',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et.',
          imageUrl: 'https://www.images.com/card.jpeg',
          rotText:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et.',
          type: '1',
        }),
      });

      const parseQueryConstructor = jest.mocked(Parse.Query);
      const parseObjectConstructor = jest.mocked(Parse.Object);

      const mockTrainingEventParseObject = {
        id: trainingEventId,
      };

      when(parseObjectConstructor)
        .calledWith(classes.TRAINING_EVENT, {
          id: trainingEventId,
        })
        .mockReturnValue(mockTrainingEventParseObject as any);

      const mockToyoPersonaTrainingEventParseQuery = {
        equalTo: jest.fn(),
        first: jest.fn(),
      };

      const mockToyoPersonaTrainingEventParseObject = {
        id: expectedResponse.id,
        get: jest.fn(),
      };

      const mockCardRewardParseObject = {
        id: expectedResponse.cardReward.id,
        get: jest.fn(),
        fetch: jest.fn(),
      };

      when(mockToyoPersonaTrainingEventParseObject.get)
        .calledWith('toyoPersona')
        .mockReturnValue(toyoPersonaId);

      when(mockToyoPersonaTrainingEventParseObject.get)
        .calledWith('trainingEvent')
        .mockReturnValue(mockTrainingEventParseObject);

      when(mockToyoPersonaTrainingEventParseObject.get)
        .calledWith('correctBlowsCombination')
        .mockReturnValue(expectedResponse.correctBlowsCombinationIds);

      when(mockToyoPersonaTrainingEventParseObject.get)
        .calledWith('cardReward')
        .mockReturnValue(mockCardRewardParseObject);

      when(mockCardRewardParseObject.get)
        .calledWith('name')
        .mockReturnValue(expectedResponse.cardReward.name);

      when(mockCardRewardParseObject.get)
        .calledWith('description')
        .mockReturnValue(expectedResponse.cardReward.description);

      when(mockCardRewardParseObject.get)
        .calledWith('imageUrl')
        .mockReturnValue(expectedResponse.cardReward.imageUrl);

      when(mockCardRewardParseObject.get)
        .calledWith('type')
        .mockReturnValue(expectedResponse.cardReward.type);

      when(mockCardRewardParseObject.get)
        .calledWith('rotText')
        .mockReturnValue(expectedResponse.cardReward.rotText);

      when(mockCardRewardParseObject.get)
        .calledWith('cardId')
        .mockReturnValue(expectedResponse.cardReward.cardId);

      parseQueryConstructor.mockReturnValue(
        mockToyoPersonaTrainingEventParseQuery as any,
      );

      mockToyoPersonaTrainingEventParseQuery.first.mockResolvedValue(
        mockToyoPersonaTrainingEventParseObject,
      );

      const response = await repository.getByTrainingEventAndToyoPersona(
        toyoPersonaId,
        trainingEventId,
      );

      expect(mockToyoPersonaTrainingEventParseQuery.equalTo).toBeCalledWith(
        'toyoPersona',
        toyoPersonaId,
      );
      expect(mockToyoPersonaTrainingEventParseQuery.equalTo).toBeCalledWith(
        'trainingEvent',
        mockTrainingEventParseObject,
      );

      expect(mockCardRewardParseObject.fetch).toBeCalled();

      expect(response).toEqual(expectedResponse);
    });

    test('When there is no training event for toyo persona then return undefined', async () => {
      const toyoPersonaId = '1';
      const trainingEventId = '1';

      const parseQueryConstructor = jest.mocked(Parse.Query);

      const mockToyoPersonaTrainingEventParseQuery = {
        equalTo: jest.fn(),
        first: jest.fn(),
      };

      parseQueryConstructor.mockReturnValue(
        mockToyoPersonaTrainingEventParseQuery as any,
      );

      mockToyoPersonaTrainingEventParseQuery.first.mockResolvedValue(undefined);

      const response = await repository.getByTrainingEventAndToyoPersona(
        toyoPersonaId,
        trainingEventId,
      );

      expect(response).toEqual(undefined);
    });
  });
});
