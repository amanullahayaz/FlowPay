import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SecurityService } from './security.service';
import { RedisSessionService } from './redis-session.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SecurityService,
    RedisSessionService,
    JwtStrategy,
  ],
  exports: [AuthService, SecurityService, RedisSessionService, PassportModule],
})
export class AuthModule {}
