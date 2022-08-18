import { TrainingStartDto } from '../dto/start.dto';

export interface TrainingService {
  start(request: TrainingStartDto): Promise<any>;
  close(request: string): Promise<any>;
  list(): Promise<any>;
}
