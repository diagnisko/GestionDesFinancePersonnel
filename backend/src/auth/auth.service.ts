import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'changeme_refresh';

function accessTokenOpts(): SignOptions {
  return { expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as any } as SignOptions;
}

function refreshTokenOpts(): SignOptions {
  return { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any } as SignOptions;
}

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, (user as any).passwordHash || '');
    if (match) return user;
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = sign(payload, JWT_SECRET, accessTokenOpts());
    const refreshToken = sign({ sub: user.id }, JWT_REFRESH_SECRET, refreshTokenOpts());

    const hashedRefresh = await bcrypt.hash(refreshToken, 12);
    await this.usersService.setRefreshTokenHash(user.id, hashedRefresh);

    return { access_token, refresh_token: refreshToken };
  }

  async logout(userId: number) {
    return this.usersService.setRefreshTokenHash(userId, null);
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = verify(refreshToken, JWT_REFRESH_SECRET) as any;
      const userId = decoded.sub;
      const user = await this.usersService.findOneById(userId);
      if (!user || !user.refreshTokenHash) throw new UnauthorizedException('Invalid refresh token');
      const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
      if (!valid) throw new UnauthorizedException('Invalid refresh token');

      const payload = { sub: user.id, email: user.email, role: user.role };
      const access_token = sign(payload, JWT_SECRET, accessTokenOpts());
      const newRefresh = sign({ sub: user.id }, JWT_REFRESH_SECRET, refreshTokenOpts());
      const hashedRefresh = await bcrypt.hash(newRefresh, 12);
      await this.usersService.setRefreshTokenHash(user.id, hashedRefresh);

      return { access_token, refresh_token: newRefresh };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(email: string) {
    // Toujours renvoyer le même message, que l'email existe ou non,
    // pour ne pas permettre à un attaquant de deviner quels comptes existent
    // (faille d'énumération d'utilisateurs).
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const token = sign({ sub: user.id }, JWT_SECRET, { expiresIn: '1h' as any });
      // TODO(prod): envoyer ce token par email via un vrai service d'emailing
      // (SendGrid, SES, etc.) plutôt que de le logger.
      console.log(`[DEV] Password reset token for ${email}: ${token}`);
    }
    return { message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = verify(token, JWT_SECRET) as any;
      const user = await this.usersService.findOneById(decoded.sub);
      const hashed = await bcrypt.hash(newPassword, 12);
      await this.usersService.updatePassword(user.id, hashed);
      await this.usersService.setRefreshTokenHash(user.id, null);
      return { ok: true };
    } catch (e) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
