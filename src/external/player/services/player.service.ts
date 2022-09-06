export interface PlayerService {
  getPlayerByWalletId(walletId: string): Promise<any>;
  getPlayerById(playerId: string): Promise<Parse.Object<Parse.Attributes>>;
}
