import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/modules/auth/auth.service';
import { UserService } from '../src/modules/user/user.service';
import { SecurityService } from '../src/modules/auth/security.service';
import { RedisSessionService } from '../src/modules/auth/redis-session.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole, KycStatus } from '../src/modules/user/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService (Security & Identity Test Suite)', () => {
  let authService: AuthService;
  let securityService: SecurityService;

  const mockUser = {
    id: 'user-uuid-1234',
    email: 'test@flowpay.io',
    password_hash: '$argon2id$v=19$m=65536,t=3,p=1$hashed_password_sample',
    first_name: 'Amanullah',
    last_name: 'Ayaz',
    role: UserRole.USER,
    kyc_status: KycStatus.UNVERIFIED,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockUserService = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked.jwt.token'),
    verify: jest.fn(),
  };

  const mockRedisSessionService = {
    setRefreshToken: jest.fn().mockResolvedValue(undefined),
    getRefreshToken: jest.fn(),
    revokeRefreshToken: jest.fn().mockResolvedValue(undefined),
    isTokenBlacklisted: jest.fn().mockResolvedValue(false),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        SecurityService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: RedisSessionService, useValue: mockRedisSessionService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    securityService = module.get<SecurityService>(SecurityService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Argon2id Hashing', () => {
    it('should securely hash plaintext password and verify correctly', async () => {
      const password = 'SuperSecureP@ssword2026!';
      const hash = await securityService.hashPassword(password);

      expect(hash).toContain('$argon2id$');
      const isValid = await securityService.verifyPassword(hash, password);
      expect(isValid).toBe(true);

      const isInvalid = await securityService.verifyPassword(hash, 'WrongPassword!');
      expect(isInvalid).toBe(false);
    });
  });

  describe('login', () => {
    it('should authenticate user with valid credentials and return JWT tokens', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(securityService, 'verifyPassword').mockResolvedValue(true);

      const result = await authService.login({
        email: 'test@flowpay.io',
        password: 'SuperSecureP@ssword2026!',
      });

      expect(result.user.email).toBe('test@flowpay.io');
      expect(result.tokens.access_token).toBe('mocked.jwt.token');
      expect(mockRedisSessionService.setRefreshToken).toHaveBeenCalledWith(
        mockUser.id,
        'mocked.jwt.token',
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(securityService, 'verifyPassword').mockResolvedValue(false);

      await expect(
        authService.login({
          email: 'test@flowpay.io',
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
