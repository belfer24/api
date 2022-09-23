import { Controller, Get, Res, Body, Post, Query } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { IAuth } from './auth.inteface';
import { OutlookOAuthDto, OutlookRedirectUrlDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('redirect')
  async getOutlookRedirectUrl(
    @Body() { chromeExtensionId }: OutlookRedirectUrlDto,
  ) {
    const redirectUrl = await this.authService.GetOutlookRedirectUrl({

      chromeExtensionId,
    });

    return { data: { redirectUrl } };
  }

  @Get('handle-redirect')
  async handleOutlookOAuth(
    @Query() query: IAuth.Controller.OutlookRedirectHandler.Query,
    @Res() res: Response,
  ) {
    const url = await this.authService.HandleOutlookOAuth(query);

    return res.redirect(url);
  }
}
