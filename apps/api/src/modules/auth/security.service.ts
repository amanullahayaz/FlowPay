import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class SecurityService {
  /**
   * Hash password using Argon2id (Memory-hard against GPU/ASIC attacks)
   */
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,
      parallelism: 1,
    });
  }

  /**
   * Compare plaintext password against Argon2id hash
   */
  async verifyPassword(hash: string, plainText: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plainText);
    } catch {
      return false;
    }
  }
}
