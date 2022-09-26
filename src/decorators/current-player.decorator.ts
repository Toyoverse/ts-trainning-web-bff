import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentPlayer = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.player;
  },
);