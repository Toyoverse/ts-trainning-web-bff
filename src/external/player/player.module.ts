import { Module } from '@nestjs/common';
import providers from './di-providers';

@Module({
  providers: [providers.PlayerService, providers.PlayerToyoService],
  exports: [providers.PlayerService, providers.PlayerToyoService],
})
export class PlayerModule {}
