import { Controller, Get, UseGuards, Req, Res, Body, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController {
  constructor (private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('windowslive'))
  async outlookAuth(@Body() body) {
    console.log(body);
  }

  @Get('/redirect')
  @UseGuards(AuthGuard('windowslive'))
  outlookAuthRedirect(@Req() req, @Res() res) {
    this.authService.outlookLogin(req); 

    return res.redirect(`chrome-extension://fdidojpkibfdhfbegdffdphabfkfkoce/oauth/oauth.html?email=${req.user.email}&token=${req.user.refreshToken}`)
  }

  @Post('outlook-redirect-url')
  async OutlookRedirectUrl(@Body() { chromeExtensionId }) {
    try {
      const { redirectUrl } = await this.authService.GetOutlookRedirectUrl({
        chromeExtensionId,
      })

      return { data: { redirectUrl } };
    } catch(error) {
      console.log(error);
    }
  }
}
