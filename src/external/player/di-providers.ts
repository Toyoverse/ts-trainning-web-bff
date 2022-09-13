import di from './di';
import { PlayerToyoServiceImpl } from './services/impl/player-toyo.service-impl';
import { PlayerServiceImpl } from './services/impl/player.service-impl';

const providers = {
  PlayerService: {
    provide: di.PLAYER_SERVICE,
    useClass: PlayerServiceImpl,
  },
  PlayerToyoService: {
    provide: di.PLAYER_TOYO_SERVICE,
    useClass: PlayerToyoServiceImpl,
  },
};

export default providers;
