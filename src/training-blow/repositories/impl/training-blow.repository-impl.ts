import { TrainingBlowModel } from 'src/training-blow/models/training-blow.model';
import { TrainingBlowRepository } from '../training-blow.repository';

import * as Parse from 'parse/node';

export class TrainingBlowRepositoryImpl implements TrainingBlowRepository {
  private readonly DATABASE_CLASS = 'TrainingBlow';

  async save(model: TrainingBlowModel): Promise<TrainingBlowModel> {
    const parseObject = this._buildParseObjectFromModel(model);
    await parseObject.save();
    return model;
  }

  async getById(id: string): Promise<TrainingBlowModel> {
    const query = new Parse.Query(this.DATABASE_CLASS);
    query.equalTo('blowId', id);

    const object = await query.first();

    if (!object) {
      return undefined;
    }

    return this._buildModelFromParseObject(object);
  }

  private _buildParseObjectFromModel(
    model: TrainingBlowModel,
  ): Parse.Object<Parse.Attributes> {
    const parseObject = new Parse.Object(this.DATABASE_CLASS);
    parseObject.set('name', model.name);
    parseObject.set('blowId', model.id);
    return parseObject;
  }

  private _buildModelFromParseObject(
    object: Parse.Object<Parse.Attributes>,
  ): TrainingBlowModel | PromiseLike<TrainingBlowModel> {
    return new TrainingBlowModel({
      id: object.get('blowId'),
      name: object.get('name'),
    });
  }
}
