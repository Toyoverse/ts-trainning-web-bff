import { Module } from '@nestjs/common';
import { publicProviders } from './di-providers';

@Module({
  providers: [...publicProviders],
  exports: publicProviders,
})
export class PlayerModule {}
