import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class SecurityService {
  private readonly passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!this.passwordRegex.test(password)) {
      errors.push(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      );
    }

    // Check for common passwords
    const commonPasswords = [
      'password',
      '123456',
      'qwerty',
      'admin',
      'letmein',
    ];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12; // Increased from default 10 for better security
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }
}
