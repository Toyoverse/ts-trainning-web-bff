import di from './di';
import { ToyoPersonaServiceImpl } from './services/impl/toyo-persona.service-impl';

const providers = {
  ToyoPersonaService: {
    provide: di.TOYO_PERSONA_SERVICE,
    useClass: ToyoPersonaServiceImpl,
  },
};

export default providers;
