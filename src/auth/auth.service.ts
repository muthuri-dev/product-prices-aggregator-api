import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';

@Injectable()
export class AuthService {
  create(createAuthInput: CreateUserInput) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: string) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: LoginUserInput) {
    return `This action updates a #${id} auth`;
  }
}
