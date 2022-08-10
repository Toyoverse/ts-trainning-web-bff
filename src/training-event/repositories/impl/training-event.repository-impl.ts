import { TrainingEventModel } from 'src/training-event/models/training-event.model';
import { TrainingEventRepository } from '../training-event.repository';

import * as Parse from 'parse/node';
import strictTransportSecurity from 'helmet/dist/types/middlewares/strict-transport-security';

export class TrainingEventRepositoryImpl implements TrainingEventRepository {
  private readonly DATABASE_CLASS = 'TrainingEvent';

  async save(model: TrainingEventModel): Promise<TrainingEventModel> {
    const parseObject = this._buildParseObjectFromModel(model);
    await parseObject.save();

    model.id = parseObject.id;
    return model;
  }

  async getCurrent(): Promise<TrainingEventModel> {
    const now = new Date();

    const query = new Parse.Query(this.DATABASE_CLASS);
    query.equalTo('isOngoing', true);
    query.lessThanOrEqualTo('startAt', now);
    query.greaterThan('endAt', now);

    const object = await query.first();

    if (!object) {
      return undefined;
    }

    return this._buildModelFromParseObject(object);
  }

  private _buildParseObjectFromModel(
    model: TrainingEventModel,
  ): Parse.Object<Parse.Attributes> {
    const parseObject = new Parse.Object('TrainingEvent');
    parseObject.set('name', model.name);
    parseObject.set('startAt', model.startAt);
    parseObject.set('endAt', model.endAt);
    parseObject.set('story', model.story);
    parseObject.set('bondReward', model.bondReward);
    parseObject.set('isOngoing', model.isOngoing);
    parseObject.set(
      'toyoTrainingConfirmationMessage',
      model.toyoTrainingConfirmationMessage,
    );
    parseObject.set('inTrainingMessage', model.inTrainingMessage);
    parseObject.set('losesMessage', model.losesMessage);
    parseObject.set('rewardMessage', model.rewardMessage);
    return parseObject;
  }

  private _buildModelFromParseObject(
    object: Parse.Object<Parse.Attributes>,
  ): TrainingEventModel {
    return new TrainingEventModel({
      id: object.id,
      name: object.get('name'),
      startAt: object.get('startAt'),
      endAt: object.get('endAt'),
      story: object.get('story'),
      bondReward: object.get('bondReward'),
      isOngoing: object.get('isOngoing'),
      toyoTrainingConfirmationMessage: object.get(
        'toyoTrainingConfirmationMessage',
      ),
      inTrainingMessage: object.get('inTrainingMessage'),
      losesMessage: object.get('losesMessage'),
      rewardMessage: object.get('rewardMessage'),
    });
  }
}
