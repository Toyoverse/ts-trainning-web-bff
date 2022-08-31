import * as Parse from 'parse/node';
import { classes } from 'src/config/back4app';
import { NotFoundError } from 'src/errors';
import { ToyoPersonaService } from '../toyo-persona.service';

export class ToyoPersonaServiceImpl implements ToyoPersonaService {
  async getById(id: string): Promise<any> {
    const parseQuery = new Parse.Query(classes.TOYO_PERSONA);
    parseQuery.equalTo('objectId', id);

    const parseObject = await parseQuery.first();

    if (!parseObject) {
      throw new NotFoundError('Toyo persona not found with id ' + id);
    }

    return { id: parseObject.id };
  }
}
