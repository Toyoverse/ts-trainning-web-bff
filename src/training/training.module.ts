import { Module } from '@nestjs/common';
import providers from './di-providers';
import { TrainingController } from './controllers/training.controller';
import { PlayerModule } from 'src/external/player/player.module';

@Module({
  imports: [PlayerModule],
  providers: providers,
  controllers: [TrainingController],
})
export class TrainingModule {}
