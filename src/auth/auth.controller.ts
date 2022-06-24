import { Controller, Post, Get, UseGuards, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController {
  constructor (private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('outlook'))
  async outlookAuth(@Req() req) {}

  @Get('/redirect')
  @UseGuards(AuthGuard('outlook'))
  outlookAuthRedirect(@Req() req) {
    return this.authService.outlookLogin(req);
  }
}
