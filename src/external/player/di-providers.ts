import di from './di';
import { PlayerToyoServiceImpl } from './services/impl/player-toyo.service-impl';
import { PlayerServiceImpl } from './services/impl/player.service-impl';

export const publicProviders = [
  {
    provide: di.PLAYER_SERVICE,
    useClass: PlayerServiceImpl,
  },
  {
    provide: di.PLAYER_TOYO_SERVICE,
    useClass: PlayerToyoServiceImpl,
  },
];
