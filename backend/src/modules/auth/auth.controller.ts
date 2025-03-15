import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: { email: string; password: string; name: string }) {
    return this.authService.signUp(userData);
  }

  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    return this.authService.signIn(credentials.email, credentials.password);
  }

  @Auth()
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  @Auth()
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.signOut(req.user.id);
  }
}