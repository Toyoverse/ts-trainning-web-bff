import { Module } from '@nestjs/common';
import { privateProviders, publicProviders } from './di-providers';
import { TrainingBlowController } from './controllers/training-blow.controller';

@Module({
  providers: [...privateProviders, ...publicProviders],
  controllers: [TrainingBlowController],
  exports: publicProviders,
})
export class TrainingBlowModule {}
