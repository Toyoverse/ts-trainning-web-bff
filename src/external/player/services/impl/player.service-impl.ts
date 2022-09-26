import * as Parse from 'parse/node';
import { classes } from 'src/config/back4app';
import { NotFoundError } from 'src/errors';
import { PlayerDto } from '../../dto/player.dto';
import { PlayerService } from '../player.service';

export class PlayerServiceImpl implements PlayerService {
  async getPlayerByWalletId(walletId: string): Promise<PlayerDto> {
    const parseQuery = new Parse.Query(classes.PLAYERS);
    parseQuery.equalTo('walletAddress', walletId);

    const parseObject = await parseQuery.first();

    if (!parseObject) {
      throw new NotFoundError(`Player not found with wallet ${walletId}`);
    }

    return { id: parseObject.id };
  }

  async getPlayerById(playerId: string): Promise<PlayerDto> {
    const parseQuery = new Parse.Query(classes.PLAYERS);
    parseQuery.equalTo('objectId', playerId);

    const player = await parseQuery.first();

    if (!player) {
      throw new NotFoundError(`Player not found with id ${playerId}`);
    }

    return { id: player.id };
  }
}
