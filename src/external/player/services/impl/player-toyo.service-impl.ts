import * as Parse from 'parse/node';
import { classes } from 'src/config/back4app';
import { UnauthorizedError } from 'src/errors/unauthorized.error';
import { ToyoDto } from '../../dto/toyo.dto';
import { PlayerToyoService } from '../player-toyo.service';

export class PlayerToyoServiceImpl implements PlayerToyoService {
  async getPlayerToyos(playerId: string): Promise<ToyoDto[]> {
    const parseQuery = new Parse.Query(classes.PLAYERS).include('toyo');
    parseQuery.equalTo('objectId', playerId);

    const parseObject = await parseQuery.first();

    if (!parseObject) {
      throw new UnauthorizedError(`Player not found with id ${playerId}`);
    }

    const toyoParseRelation: Parse.Relation = parseObject.get('toyos');
    const toyoParseObjects = await toyoParseRelation.query().find();

    return toyoParseObjects.map(this._toModel);
  }

  async getPlayerToyoAutomatas(playerId: string): Promise<ToyoDto[]> {
    const parseQuery = new Parse.Query(classes.PLAYERS).include(
      'toyoAutomatas',
    );
    parseQuery.equalTo('objectId', playerId);

    const parseObject = await parseQuery.first();

    if (!parseObject) {
      throw new UnauthorizedError(`Player not found with id ${playerId}`);
    }

    const toyoParseRelation: Parse.Relation = parseObject.get('toyoAutomatas');
    const toyoParseObjects = await toyoParseRelation.query().find();

    return toyoParseObjects.map(this._toModel);
  }

  private _toModel(parseObject: Parse.Object<Parse.Attributes>): ToyoDto {
    return new ToyoDto({
      id: parseObject.id,
      tokenId: parseObject.get('tokenId'),
    });
  }
}
