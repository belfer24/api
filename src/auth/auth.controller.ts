import { Controller, Get, Res, Body, Post, Query } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { IAuth } from './auth.inteface';
import { OutlookRedirectUrlDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //TODO: Подумать как убрать chromeExtensionId
  @Post('redirect')
  async GetOutlookRedirectUrl(
    @Body() { chromeExtensionId }: OutlookRedirectUrlDto,
  ) {
    const redirectUrl = await this.authService.GetOutlookRedirectUrl({
      chromeExtensionId,
    });

    return { data: { redirectUrl } };
  }

  @Get('handle-redirect')
  async HandleOutlookOAuth(
    @Query() query: IAuth.Controller.OutlookRedirectHandler.Query,
    @Res() res: Response,
  ) {
    const url = await this.authService.HandleOutlookOAuth(query);

    return res.redirect(url);
  }
}
