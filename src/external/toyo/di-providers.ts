import di from './di';
import { ToyoPersonaServiceImpl } from './services/impl/toyo-persona.service-impl';
import { ToyoServiceImpl } from './services/impl/toyo.service-impl';

export const publicProviders = [
  {
    provide: di.TOYO_PERSONA_SERVICE,
    useClass: ToyoPersonaServiceImpl,
  },
  {
    provide: di.TOYO_SERVICE,
    useClass: ToyoServiceImpl,
  },
];
