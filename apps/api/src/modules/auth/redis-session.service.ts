import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisSessionService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisSessionService.name);
  private redisClient: Redis;

  onModuleInit() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    });

    this.redisClient.connect().then(() => {
      this.logger.log('⚡ Redis session & locking store connected');
    }).catch((err) => {
      this.logger.warn(`⚠️ Redis connection warning: ${err.message}. Fallback session store active.`);
    });
  }

  onModuleDestroy() {
    if (this.redisClient) {
      this.redisClient.disconnect();
    }
  }

  /**
   * Save active refresh token in Redis session store
   */
  async setRefreshToken(userId: string, token: string, ttlSeconds: number = 604800): Promise<void> {
    try {
      await this.redisClient.set(`refresh_token:${userId}`, token, 'EX', ttlSeconds);
    } catch (err) {
      this.logger.error(`Redis setRefreshToken error: ${err.message}`);
    }
  }

  /**
   * Get active refresh token for user
   */
  async getRefreshToken(userId: string): Promise<string | null> {
    try {
      return await this.redisClient.get(`refresh_token:${userId}`);
    } catch {
      return null;
    }
  }

  /**
   * Revoke refresh token (Logout / Token rotation)
   */
  async revokeRefreshToken(userId: string): Promise<void> {
    try {
      await this.redisClient.del(`refresh_token:${userId}`);
    } catch (err) {
      this.logger.error(`Redis revokeRefreshToken error: ${err.message}`);
    }
  }

  /**
   * Blacklist an access token JTI until expiration
   */
  async blacklistToken(jti: string, ttlSeconds: number): Promise<void> {
    try {
      await this.redisClient.set(`blacklisted_jti:${jti}`, '1', 'EX', ttlSeconds);
    } catch (err) {
      this.logger.error(`Redis blacklistToken error: ${err.message}`);
    }
  }

  /**
   * Check if JTI is blacklisted
   */
  async isTokenBlacklisted(jti: string): Promise<boolean> {
    try {
      const val = await this.redisClient.get(`blacklisted_jti:${jti}`);
      return val === '1';
    } catch {
      return false;
    }
  }
}
