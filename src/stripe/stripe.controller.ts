import { Body, Controller, Post, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(
    private StripeService: StripeService
  ) {}

  @Post('/create-portal')
  async createPortal(@Body() body, @Res() res) {
    const redirectLink = await this.StripeService.createStripeProtal(body);
    
    return res.redirect(redirectLink);
  }
}
