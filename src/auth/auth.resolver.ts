import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  createAuth(@Args('createAuthInput') createAuthInput: CreateUserInput) {
    return this.authService.create(createAuthInput);
  }

  @Query(() => [User])
  findAll() {
    return this.authService.findAll();
  }

  @Query(() => User)
  findOne(@Args('id') id: string) {
    return this.authService.findOne(id);
  }

  // @Mutation(() => User)
  // updateAuth(@Args('updateAuthInput') updateAuthInput: LoginUserInput) {
  //   return this.authService.update( updateAuthInput);
  // }
}
