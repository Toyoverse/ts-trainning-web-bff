import * as jwt from 'jsonwebtoken';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PlayerService } from 'src/external/player/services/player.service';
import di from 'src/training/di';

interface TokenPayload {
  walletId: string;
  transaction: string;
  iat: number;
  exp: number;
}

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    @Inject(di.PLAYER_SERVICE)
    private playerService: PlayerService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization.split(' ')[1];

    if (!token) {
      throw new Error('Ocorreu um erro ao verificar o player');
    }

    const data = jwt.verify(token, process.env.TOKEN_SECRET);

    const { walletId } = data as TokenPayload;

    if (!walletId) {
      throw new Error('Ocorreu um erro ao verificar o player');
    }

    const player = await this.playerService.getPlayerByWalletId(walletId);
    console.log('Player', player);

    response.locals.playerId = player.id;

    return next.handle();
  }
}
