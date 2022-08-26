import { Controller, Get, Res, Body, Post, Query } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { IAuth } from './auth.inteface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('outlook-redirect-url')
  async getOutlookRedirectUrl(
    @Body() { chromeExtensionId }: { chromeExtensionId: string },
  ) {
    const { redirectUrl } = await this.authService.GetOutlookRedirectUrl({
      chromeExtensionId,
    });

    return { data: { redirectUrl } };
  }

  @Get('redirect')
  async OutlookOAuthHandler(
    @Query() query: IAuth.Controller.OutlookRedirectHandler.Query,
    @Res() res: Response,
  ) {
    const { redirectUrl }: { redirectUrl: string } =
      await this.authService.OutlookOAuthHandler(query);

    return res.redirect(redirectUrl);
  }
}
