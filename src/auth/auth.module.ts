import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from './security/strategies/jwt.strategy';
import { GqlAuthGuard } from './security/guards/gql-auth.guard';
import { ConfigService } from '@nestjs/config';
import { UserCustomRepository } from './repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfirmEmailService } from '../emails/confirm-email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    GqlAuthGuard,
    ConfigService,
    UserCustomRepository,
    JwtService,
    ConfirmEmailService,
  ],
})
export class AuthModule {}
