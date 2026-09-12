import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import type { Response } from "express";
import { UsersService } from "../users/users.service.js";
import { User } from "../users/user.entity.js";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService
    ) {}

    async register(email: string, password: string): Promise<User> {
        return this.userService.create(email, password);
    }

    async login(email: string, password: string, res: Response) {
        const user = await this.userService.findUserByEmail(email);
        if (!user) throw new UnauthorizedException('El usuario no existe');

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) throw new UnauthorizedException('Contraseña incorrecta');

        const token = this.jwtService.sign({ sub: user.id, email: user.email });

        res.cookie(this.config.get('COOKIE_NAME', 'auth_token'), token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: this.config.get('NODE_DEV') === 'production',
            maxAge: 1000*60*10
        });

        return { id: user.id, email: user.email };
    }

    async logout (res: Response){
        res.clearCookie(this.config.get('COOKIE_NAME', 'auth_token'));
    }
}