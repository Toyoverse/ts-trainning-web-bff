import * as Parse from 'parse/node';
import { classes } from 'src/config/back4app';
import { NotFoundError } from 'src/errors';
import { PlayerService } from '../player.service';

export class PlayerServiceImpl implements PlayerService {
  async getPlayerByWalletId(walletId: string): Promise<any> {
    const parseQuery = new Parse.Query(classes.PLAYERS);
    parseQuery.equalTo('walletAddress', walletId);

    const parseObject = await parseQuery.first();

    if (!parseObject) {
      throw new NotFoundError('Player not found with wallet ' + walletId);
    }

    return { id: parseObject.id };
  }
}
