import { Body, Controller, Post } from '@nestjs/common';
import { CreatePortalDto } from './dto/stripe.dto';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private StripeService: StripeService) {}

  @Post('create-portal')
  async createPortal(@Body() body: CreatePortalDto) {
    const { refreshToken, returnUrl } = body;
    const redirectLink = await this.StripeService.CreateStripePortal({
      refreshToken,
      returnUrl,
    });

    return redirectLink;
  }
}
