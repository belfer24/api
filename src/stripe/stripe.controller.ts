import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreatePortalDto } from './dto/stripe.dto';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private StripeService: StripeService) {}

  @Post('create-portal')
  async createPortal(
    @Body() body: CreatePortalDto,
    @Res() res: Response,
  ) {
    const { refreshToken, returnUrl } = body;
    const redirectLink = (await this.StripeService.CreateStripePortal({
      refreshToken,
      returnUrl,
    }
    )).data.portalLink;

    if (redirectLink) {
      return res.redirect(redirectLink);
    } else {
      return res.status(400).send({ 
        error: 'Redirect link for Stripe Portal is invalid!'
      })
    }
  }
}
