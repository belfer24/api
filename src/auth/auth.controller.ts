import { Controller, Get, Res, Body, Post, Query } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { IAuth } from './auth.inteface';
import { OutlookOAuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('redirect')
  async getOutlookRedirectUrl() {
    const redirectUrl = await this.authService.GetOutlookRedirectUrl();

    return { data: { redirectUrl } };
  }
  // handle-redirect
  @Get('handle-redirect')
  async handleOutlookOAuth(
    @Query() query: IAuth.Controller.OutlookRedirectHandler.Query,
    @Res() res: Response,
  ) {
    //TODO: Придумай понятное название для переменной
    const redirectUrl = await this.authService.HandleOutlookOAuth(query);

    return res.redirect(redirectUrl);
  }
}
