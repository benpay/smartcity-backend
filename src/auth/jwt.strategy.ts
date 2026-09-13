
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { UsersService } from '../users/users.service.js';
import { User } from '../users/user.entity.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          (req as Request & { cookies?: Record<string, string> }).cookies?.[
          config.get('COOKIE_NAME', 'auth_token')
          ],
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string, email: string }): Promise<User> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) { throw new UnauthorizedException(`El usuario con ID ${payload.sub} no existe o no está autenticado`); }
    return user;
  }
}