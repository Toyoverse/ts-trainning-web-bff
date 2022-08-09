import { TrainingEventModel } from 'src/training-event/models/training-event.model';
import { TrainingEventRepository } from '../training-event.repository';

import * as Parse from 'parse/node';

export class TrainingEventRepositoryImpl implements TrainingEventRepository {
  async save(model: TrainingEventModel): Promise<TrainingEventModel> {
    const parseObject = this._buildParseObject(model);
    await parseObject.save();

    model.id = parseObject.id;
    return model;
  }

  private _buildParseObject(
    model: TrainingEventModel,
  ): Parse.Object<Parse.Attributes> {
    const parseObject = new Parse.Object('TrainingEvent');
    parseObject.set('name', model.name);
    parseObject.set('startAt', model.startAt);
    parseObject.set('endAt', model.endAt);
    parseObject.set('bondReward', model.bondReward);
    parseObject.set('isOngoing', model.isOngoing);
    parseObject.set('inTrainingMessage', model.inTrainingMessage);
    parseObject.set('losesMessage', model.losesMessage);
    parseObject.set('rewardMessage', model.rewardMessage);
    return parseObject;
  }
}
