import * as jwt from 'jsonwebtoken';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PlayerService } from 'src/external/player/services/player.service';
import di from 'src/external/player/di';

interface TokenPayload {
  walletId: string;
  transaction: string;
  iat: number;
  exp: number;
}

@Injectable()
export class CurrentPlayerInterceptor implements NestInterceptor {
  constructor(
    @Inject(di.PLAYER_SERVICE)
    private playerService: PlayerService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    try {
      const request = context.switchToHttp().getRequest();

      const token = request.headers.authorization;

      if (!token) {
        throw new UnauthorizedException('Token invalid!');
      }

      const data = jwt.verify(token, process.env.TOKEN_SECRET);

      const { walletId } = data as TokenPayload;

      if (!walletId) {
        throw new UnauthorizedException('Token invalid!');
      }

      const player = await this.playerService.getPlayerByWalletId(walletId);

      request.player = player;

      return next.handle();
    } catch (e) {
      // const request = context.switchToHttp().getRequest();
      // const walletId = '0x0000000000000000000000000000000000000000';
      // const player = await this.playerService.getPlayerByWalletId(walletId);

      // request.player = player;

      // return next.handle();
      throw new UnauthorizedException('Token invalid!');
    }
  }
}
