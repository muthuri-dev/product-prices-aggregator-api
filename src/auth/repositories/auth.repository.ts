import { Injectable, Logger, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from '../dto/create-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserCustomRepository {
  private saltRounds: number = 10;
  private logger: Logger = new Logger(UserCustomRepository.name);

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  // check if email exists in the database
  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async create(inputArgs: CreateUserInput): Promise<User> {
    const userExists = await this.findUserByEmail(inputArgs.email);

    if (userExists)
      throw new NotAcceptableException('User with the email already exists');

    //password hashing
    const hashedPass = await bcrypt.hash(inputArgs.password, this.saltRounds);

    //trimming user emails
    const trimEmail: string = inputArgs.email.trim().toLowerCase();

    //create user
    const newUser = this.usersRepository.create({
      ...inputArgs,
      email: trimEmail,
      password: hashedPass,
    });

    return await this.usersRepository.save(newUser);
  }

  async update(user: User, refreshToken: string): Promise<User> {
    user.refreshToken = refreshToken;
    return await this.usersRepository.save(user);
  }
}
