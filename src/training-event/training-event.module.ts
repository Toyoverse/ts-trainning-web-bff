import { Module } from '@nestjs/common';
import providers from './di-providers';
import { TrainingEventController } from './controllers/training-event.controller';

@Module({
  providers: providers,
  controllers: [TrainingEventController],
})
export class TrainingEventModule {}
