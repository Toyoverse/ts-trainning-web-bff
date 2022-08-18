import { Module } from '@nestjs/common';
import providers from './di-providers';
import { TrainingController } from './controllers/training.controller';

@Module({
  providers: providers,
  controllers: [TrainingController],
})
export class TrainingModule {}
