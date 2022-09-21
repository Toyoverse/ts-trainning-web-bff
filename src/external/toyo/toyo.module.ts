import { Module } from '@nestjs/common';
import providers from './di-providers';

@Module({
  providers: [providers.ToyoPersonaService, providers.ToyoService],
  exports: [providers.ToyoPersonaService, providers.ToyoService],
})
export class ToyoModule {}
