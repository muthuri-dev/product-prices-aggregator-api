import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserCustomRepository } from './repositories/auth.repository';
import { ConfirmEmailService } from '../emails/confirm-email.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
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

  async confirmEmailToken() {}

  async register(inputArgs: CreateUserInput): Promise<LoginSuccess> {
    const user = await this.userCustomRepository.create(inputArgs);

    const { accessToken, refreshToken } = await this.generateTokens(user);

    const [confirmationToken, part2] = accessToken.split('.', 2);

    await this.emailService.sendConfirmationEmail(
      user.email,
      confirmationToken,
      user.username,
    );

    return {
      accessToken,
      refreshToken,
      message:
        'Registration successful. Please check your email to confirm your account',
    };
  }
}
