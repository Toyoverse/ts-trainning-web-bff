export interface PlayerService {
  getPlayerByWalletId(walletId: string): Promise<any>;
}
