import * as Parse from 'parse/node';

import { classes } from 'src/config/back4app';

import { TrainingEventModel } from 'src/training-event/models/training-event.model';
import { TrainingEventRepository } from '../training-event.repository';

export class TrainingEventRepositoryImpl implements TrainingEventRepository {
  async save(model: TrainingEventModel): Promise<TrainingEventModel> {
    const parseObject = await this._buildParseObjectFromModel(model);
    await parseObject.save();

    model.id = parseObject.id;
    return model;
  }

  async getCurrent(): Promise<TrainingEventModel> {
    const now = new Date();

    const query = new Parse.Query(classes.TRAINING_EVENT);
    query.equalTo('isOngoing', true);
    query.lessThanOrEqualTo('startAt', now);
    query.greaterThan('endAt', now);

    const object = await query.first();

    if (!object) {
      return undefined;
    }

    return this._buildModelFromParseObject(object);
  }

  private async _buildParseObjectFromModel(
    model: TrainingEventModel,
  ): Promise<Parse.Object<Parse.Attributes>> {
    const parseObject = new Parse.Object(classes.TRAINING_EVENT);
    parseObject.set('name', model.name);
    parseObject.set('startAt', model.startAt);
    parseObject.set('endAt', model.endAt);
    parseObject.set('story', model.story);
    parseObject.set('bondReward', model.bondReward);
    parseObject.set('bonusBondReward', model.bonusBondReward);
    parseObject.set('isOngoing', model.isOngoing);
    parseObject.set(
      'toyoTrainingConfirmationMessage',
      model.toyoTrainingConfirmationMessage,
    );
    parseObject.set('inTrainingMessage', model.inTrainingMessage);
    parseObject.set('losesMessage', model.losesMessage);
    parseObject.set('rewardMessage', model.rewardMessage);
    parseObject.set('blows', model.blows);
    parseObject.set('blowsConfig', model.blowsConfig);
    return parseObject;
  }

  private async _buildModelFromParseObject(
    object: Parse.Object<Parse.Attributes>,
  ): Promise<TrainingEventModel> {
    return new TrainingEventModel({
      id: object.id,
      name: object.get('name'),
      startAt: object.get('startAt'),
      endAt: object.get('endAt'),
      story: object.get('story'),
      bondReward: object.get('bondReward'),
      bonusBondReward: object.get('bonusBondReward'),
      isOngoing: object.get('isOngoing'),
      toyoTrainingConfirmationMessage: object.get(
        'toyoTrainingConfirmationMessage',
      ),
      inTrainingMessage: object.get('inTrainingMessage'),
      losesMessage: object.get('losesMessage'),
      rewardMessage: object.get('rewardMessage'),
      blows: object.get('blows'),
      blowsConfig: object.get('blowsConfig'),
    });
  }
}
