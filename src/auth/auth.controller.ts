import { Controller, Get, UseGuards, Req, Res, Body, Post, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { query } from "express";

@Controller('auth')
export class AuthController {
  constructor (private authService: AuthService) {}

  @Post('/outlook-redirect-url')
  async OutlookRedirectUrl(@Body() { chromeExtensionId }) {
    try {
      const { redirectUrl } = await this.authService.GetOutlookRedirectUrl({ chromeExtensionId })

      return { data: { redirectUrl } };
    } catch(error) {
      console.log(error);
    }
  }

  @Get('/redirect')
  async OutlookOAuthHandler(@Query() query, @Res() res) {
    try {
      const { redirectUrl } = await this.authService.OutlookOAuthHandler(query);

      return res.redirect(redirectUrl);
    } catch (error) {
      throw error;
    }
  }
}
