import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { RedisSessionService } from '../redis-session.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  jti?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly redisSessionService: RedisSessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super_secret_flowpay_jwt_key_change_in_production_2026',
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.jti) {
      const isBlacklisted = await this.redisSessionService.isTokenBlacklisted(payload.jti);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }
    }

    const user = await this.userService.findById(payload.sub);
    if (!user || !user.is_active) {
      throw new UnauthorizedException('User account is inactive or disabled');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      kyc_status: user.kyc_status,
      first_name: user.first_name,
      last_name: user.last_name,
    };
  }
}
