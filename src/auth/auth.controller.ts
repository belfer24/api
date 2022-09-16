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
    const { redirectUrl } = await this.authService.GetOutlookRedirectUrl();

    return { data: { redirectUrl } };
  }

  @Get('redirect/handle-redirect')
  async handleOutlookOAuth(
    @Query() query: IAuth.Controller.OutlookRedirectHandler.Query,
    @Res() res: Response,
  ) {
    const { redirectUrl }: OutlookOAuthDto =
      await this.authService.HandleOutlookOAuth(query);

    return res.redirect(redirectUrl);
  }
}
