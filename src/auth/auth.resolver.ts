import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { LoginSuccess, Success } from './entities/login-success.entity';
import { LoginUserInput } from './dto/login-user.input';
import { CurrentUser } from './decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './security/guards/gql-auth.guard';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Success)
  async registerUser(@Args('createArgs') createArgs: CreateUserInput) {
    return await this.authService.register(createArgs);
  }

  @Mutation(() => LoginSuccess)
  async login(@Args('loginArgs') loginArgs: LoginUserInput) {
    return await this.authService.login(loginArgs);
  }

  @Mutation(() => Success)
  async confirmEmailToken(@Args('activationToken') activationToken: string) {
    return await this.authService.confirmEmailToken(activationToken);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Success)
  async logout(@CurrentUser() user: User) {
    return await this.authService.logout(user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    return await this.authService.getUsers();
  }
}
