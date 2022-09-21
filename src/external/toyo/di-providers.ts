import di from './di';
import { ToyoPersonaServiceImpl } from './services/impl/toyo-persona.service-impl';
import { ToyoServiceImpl } from './services/impl/toyo.service-impl';

const providers = {
  ToyoPersonaService: {
    provide: di.TOYO_PERSONA_SERVICE,
    useClass: ToyoPersonaServiceImpl,
  },
  ToyoService: {
    provide: di.TOYO_SERVICE,
    useClass: ToyoServiceImpl,
  },
};

export default providers;
