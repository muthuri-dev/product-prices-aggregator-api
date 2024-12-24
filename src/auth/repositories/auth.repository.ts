import {
  ForbiddenException,
  Injectable,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from '../dto/create-user.input';
import * as bcrypt from 'bcrypt';
import { LoginUserInput } from '../dto/login-user.input';

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

  async updateUserRT(user: User, refreshToken: string): Promise<User> {
    user.refreshToken = refreshToken;
    return await this.usersRepository.save(user);
  }

  async updateUserACNT(user: User, activationToken: string): Promise<User> {
    user.activationToken = activationToken;
    return await this.usersRepository.save(user);
  }

  async findActivationToken(activationToken: string) {
    const user = await this.usersRepository.findOne({
      where: { activationToken },
    });

    if (!user)
      throw new NotAcceptableException(
        'Check your mail for correct email to Verify ',
      );

    return user;
  }

  async login(inputArgs: LoginUserInput) {
    const user = await this.findUserByEmail(inputArgs.email);

    if (!user) throw new ForbiddenException('User not found, Register!!');

    if (user.activationToken)
      throw new ForbiddenException('Please confirm your email');

    //confirming password
    const isPasswordMatch: boolean = await bcrypt.compare(
      inputArgs.password,
      user.password,
    );
    if (!isPasswordMatch) throw new ForbiddenException('Incorrect password');

    return user;
  }

  async getAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }
}
