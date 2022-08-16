import { Module } from '@nestjs/common';
import providers from './di-providers';
import { TrainingBlowController } from './controllers/training-blow.controller';

@Module({
  providers: [providers.TrainingBlowRepository, providers.TrainingBlowService],
  controllers: [TrainingBlowController],
  exports: [providers.TrainingBlowService],
})
export class TrainingBlowModule {}
