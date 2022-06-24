import { Controller, Request, Post, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}
}
