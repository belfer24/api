import { Controller, Get, UseGuards, Req, Res, Redirect } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController {
  constructor (private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('windowslive'))
  async outlookAuth(@Req() req, @Res() res) {
    console.log(res, req);
  }

  @Get('/redirect')
  @UseGuards(AuthGuard('windowslive'))
  outlookAuthRedirect(@Req() req, @Res() res) {
    this.authService.outlookLogin(req);

    return res.redirect(`chrome-extension://pionipbkhdefhnbclaoipdpkaemepbkb/oauth/oauth.html?email=${req.user.email}&token=${req.user.refreshToken}`)
  }
}
