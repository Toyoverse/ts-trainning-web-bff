import { PlayerDto } from '../dto/player.dto';

export interface PlayerService {
  getPlayerByWalletId(walletId: string): Promise<PlayerDto>;
  getPlayerById(playerId: string): Promise<PlayerDto>;
}
