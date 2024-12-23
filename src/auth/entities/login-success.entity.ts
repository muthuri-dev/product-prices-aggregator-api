import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginSuccess {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  message: string;
}
