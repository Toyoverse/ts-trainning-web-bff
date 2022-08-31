import { Module } from '@nestjs/common';
import providers from './di-providers';

@Module({
  providers: [providers.ToyoPersonaService],
  exports: [providers.ToyoPersonaService],
})
export class ToyoModule {}
