import { Module } from '@nestjs/common';
import providers from './di-providers';
import { TrainingBlowController } from './controllers/training-blow.controller';

@Module({
  providers,
  controllers: [TrainingBlowController],
})
export class TrainingBlowModule {}
