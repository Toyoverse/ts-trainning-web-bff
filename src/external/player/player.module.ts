import { Module } from '@nestjs/common';
import providers from './di-providers';

@Module({
  providers: [providers.PlayerService],
  exports: [providers.PlayerService],
})
export class PlayerModule {}
