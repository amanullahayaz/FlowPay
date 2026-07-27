import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SecurityService } from './security.service';
import { RedisSessionService } from './redis-session.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../user/entities/user.entity';

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly securityService: SecurityService,
    private readonly jwtService: JwtService,
    private readonly redisSessionService: RedisSessionService,
  ) {}

  async register(registerDto: RegisterDto) {
    const password_hash = await this.securityService.hashPassword(registerDto.password);

    const user = await this.userService.createUser({
      email: registerDto.email,
      password_hash,
      first_name: registerDto.first_name,
      last_name: registerDto.last_name,
      role: registerDto.role || UserRole.USER,
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.redisSessionService.setRefreshToken(user.id, tokens.refresh_token);

    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        kyc_status: user.kyc_status,
      },
      tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await this.securityService.verifyPassword(
      user.password_hash,
      loginDto.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('User account is disabled');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.redisSessionService.setRefreshToken(user.id, tokens.refresh_token);

    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        kyc_status: user.kyc_status,
      },
      tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET || 'super_secret_flowpay_refresh_key_2026',
      });

      const storedToken = await this.redisSessionService.getRefreshToken(payload.sub);
      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedException('Refresh token is invalid or has been revoked');
      }

      const user = await this.userService.findById(payload.sub);
      const tokens = await this.generateTokens(user.id, user.email, user.role);
      await this.redisSessionService.setRefreshToken(user.id, tokens.refresh_token);

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string): Promise<{ success: boolean }> {
    await this.redisSessionService.revokeRefreshToken(userId);
    return { success: true };
  }

  private async generateTokens(userId: string, email: string, role: string): Promise<AuthTokens> {
    const payload = { sub: userId, email, role };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'super_secret_flowpay_jwt_key_change_in_production_2026',
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET || 'super_secret_flowpay_refresh_key_2026',
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
      expires_in: 900, // 15 mins in seconds
    };
  }
}
