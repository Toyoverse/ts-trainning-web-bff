import di from './di';
import { PlayerServiceImpl } from './services/impl/player.service-impl';

const providers = {
  PlayerService: {
    provide: di.PLAYER_SERVICE,
    useClass: PlayerServiceImpl,
  },
};

export default providers;
