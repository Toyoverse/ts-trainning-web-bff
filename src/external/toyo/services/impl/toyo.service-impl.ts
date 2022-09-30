import * as Parse from 'parse/node';
import { classes } from 'src/config/back4app';
import { NotFoundError } from 'src/errors';
import { ToyoDto } from '../../dto/toyo/dto';
import { ToyoService } from '../toyo.service';

export class ToyoServiceImpl implements ToyoService {
  async getById(id: string): Promise<ToyoDto> {
    const parseQuery = new Parse.Query(classes.TOYO);
    parseQuery.equalTo('objectId', id);

    const toyoParseObject = await parseQuery.first();

    if (!toyoParseObject) {
      throw new NotFoundError(`Toyo with id ${id} not found`);
    }

    return new ToyoDto({
      id: toyoParseObject.id,
      tokenId: toyoParseObject.get('tokenId'),
      personaId: toyoParseObject.get('toyoPersonaOrigin').id,
    });
  }
  async getToyoById(toyoId: string): Promise<Parse.Object<Parse.Attributes>> {
    const parseQuery = new Parse.Query(classes.TOYO);
    parseQuery.equalTo('objectId', toyoId);

    const toyo = await parseQuery.first();

    if (!toyo) {
      throw new NotFoundError(`Toyo with id ${toyoId} not found`);
    }

    return toyo;
  }

  async getToyoByTokenId(
    toyoTokenId: string,
  ): Promise<Parse.Object<Parse.Attributes>> {
    const query = new Parse.Query(classes.TOYO);
    query.equalTo('tokenId', toyoTokenId);

    const toyo = await query.first();

    if (!toyo) {
      throw new NotFoundError(`Toyo with tokenId ${toyoTokenId} not found`);
    }

    return toyo;
  }
}
