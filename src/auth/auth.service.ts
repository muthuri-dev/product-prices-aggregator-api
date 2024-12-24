import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserCustomRepository } from './repositories/auth.repository';
import { ConfirmEmailService } from '../emails/confirm-email.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { LoginSuccess } from './entities/login-success.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userCustomRepository: UserCustomRepository,
    private readonly jwtService: JwtService,
    private emailService: ConfirmEmailService,
  ) {}

  async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign(
      { _id: user._id, email: user.email, username: user.username },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '1d',
      },
    );

    const refreshToken = this.jwtService.sign(
      { _id: user._id, accessToken },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  async confirmEmailToken(activationToken: string) {
    const user =
      await this.userCustomRepository.findActivationToken(activationToken);

    await this.userCustomRepository.updateUserACNT(user, null);

    return {
      message: 'Email confirmed successfully',
    };
  }

  async register(inputArgs: CreateUserInput) {
    const user = await this.userCustomRepository.create(inputArgs);

    const { accessToken } = await this.generateTokens(user);

    const [part1, confirmationToken] = accessToken.split('.', 2);

    await this.emailService.sendConfirmationEmail(
      user.email,
      confirmationToken,
      user.username,
    );

    await this.userCustomRepository.updateUserACNT(user, confirmationToken);

    return {
      message:
        'Registration successful. Please check your email to confirm your account',
    };
  }

  async login(inputArgs: LoginUserInput): Promise<LoginSuccess> {
    const user = await this.userCustomRepository.login(inputArgs);

    const { accessToken, refreshToken } = await this.generateTokens(user);

    await this.userCustomRepository.updateUserRT(user, refreshToken);

    return { accessToken, refreshToken, message: 'Login successful' };
  }

  async logout(user: User) {
    await this.userCustomRepository.updateUserRT(user, null);

    return { message: 'Logout successful' };
  }

  async getUsers(): Promise<User[]> {
    return await this.userCustomRepository.getAll();
  }
}
