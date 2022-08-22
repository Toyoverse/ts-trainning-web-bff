import * as Parse from 'parse/node';
import { classes } from 'src/config/back4app';
import { ConstraintViolationError } from 'src/errors';
import { CardTrainingRewardModel } from 'src/training-event/models/card-training-reward.model';
import { ToyoPersonaTrainingEventModel } from 'src/training-event/models/toyo-persona-training-event.model';
import { ToyoPersonaTrainingEventRepository } from '../toyo-persona-training-event.repository';

export class ToyoPersonaTrainingEventRepositoryImpl
  implements ToyoPersonaTrainingEventRepository
{
  async save(
    model: ToyoPersonaTrainingEventModel,
  ): Promise<ToyoPersonaTrainingEventModel> {
    const trainingEventParseQuery = new Parse.Query(classes.TRAINING_EVENT);
    trainingEventParseQuery.equalTo('objectId', model.trainingEventId);
    const trainingEventParseObject = await trainingEventParseQuery.first();

    if (!trainingEventParseObject) {
      throw new ConstraintViolationError(
        'Training event not found with id ' + model.trainingEventId,
      );
    }

    const cardParseObject = this._buildCardTrainingRewardParseObject(
      model.cardReward,
    );

    await cardParseObject.save();

    const toyoPersonaTrainingEventParseObject =
      this._buildToyoPersonaTrainingEventParseObject(
        model,
        trainingEventParseObject,
        cardParseObject,
      );

    await toyoPersonaTrainingEventParseObject.save();

    model.id = toyoPersonaTrainingEventParseObject.id;
    return model;
  }

  private _buildCardTrainingRewardParseObject(
    cardModel: CardTrainingRewardModel,
  ): Parse.Object<Parse.Attributes> {
    const cardRewardParseObject = new Parse.Object(
      classes.CARD_TRAINING_REWARD,
    );

    cardRewardParseObject.set('name', cardModel.name);
    cardRewardParseObject.set('description', cardModel.description);
    cardRewardParseObject.set('rotText', cardModel.rotText);
    cardRewardParseObject.set('type', cardModel.type);
    cardRewardParseObject.set('cardId', cardModel.cardId);

    return cardRewardParseObject;
  }

  private _buildToyoPersonaTrainingEventParseObject(
    model: ToyoPersonaTrainingEventModel,
    trainingEventParseObject: Parse.Object<Parse.Attributes>,
    cardRewardParseObject: Parse.Object<Parse.Attributes>,
  ): Parse.Object<Parse.Attributes> {
    const toyoPersonaTrainingEventParseObject = new Parse.Object(
      classes.TOYO_PERSONA_TRAINING_EVENT,
    );

    toyoPersonaTrainingEventParseObject.set(
      'trainingEvent',
      trainingEventParseObject.toPointer(),
    );
    toyoPersonaTrainingEventParseObject.set('toyoPersona', model.toyoPersonaId);
    toyoPersonaTrainingEventParseObject.set(
      'correctBlowsCombination',
      model.correctBlowsCombinationIds,
    );
    toyoPersonaTrainingEventParseObject.set(
      'cardReward',
      cardRewardParseObject.toPointer(),
    );
    return toyoPersonaTrainingEventParseObject;
  }
}
