import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto } from './dto/auth.dto.js';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const user = await this.authService.register(dto.email, dto.password);
        return { id: user.id, email: user.email };
    }

    @Post('login')
    @HttpCode(200)
    // Usamos passthrough para dejar a NestJS al mando de la Res y solo necesitar modificar el token
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        return await this.authService.login(dto.email, dto.password, res);
    }

    @Post('logout')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async logout(@Res ({ passthrough: true }) res: Response) {
        this.authService.logout(res);
        return { message: 'Logged out sucessfully' };
    }

    @Get('me')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async me (@Req() req: any) {
        return req.user;
    }
}