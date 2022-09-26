import { ListTrainingDto } from '../dto/list.dto';
import { TrainingStartRequestDto } from '../dto/training-start-request.dto';
import { TrainingResponseDto } from '../dto/training-response.dto';

export interface TrainingService {
  start(id: TrainingStartRequestDto): Promise<TrainingResponseDto>;
  close(id: string, loggedPlayerId: string): Promise<TrainingResponseDto>;
  list(id: string): Promise<ListTrainingDto[]>;
  getResult(id: string, loggedPlayerId: string): Promise<TrainingResponseDto>;
}
