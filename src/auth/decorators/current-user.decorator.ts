import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface IUser {
  _id: string;
  email: string;
  username: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): IUser => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
