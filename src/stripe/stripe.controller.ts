import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { IStripeWebhook } from './stripe.interface';

@Controller('stripe')
export class StripeController {
  constructor(private StripeService: StripeService) {}

  @Post('create-portal')
  async createPortal(@Body() body: { email: string }, @Res() res: Response) {
    const redirectLink = await this.StripeService.createStripeProtal(body) || '';

    return res.redirect(redirectLink);
  }

  @Post('webhook-customer-created')
  async customerCreated(@Body() body: Stripe.Event) {
    return await this.StripeService.customerCreated(body);
  }

  @Post('webhook-update-subscription')
  async updateSubscription(@Body() body: Stripe.Event) {
    const customer = body.data.object;

    console.log('Update Subscription: ', body.data.object);
  }

  @Post('webhook-payment-success')
  async successPayment(@Body() body: Stripe.Event) {
    return await this.StripeService.updatePremiumStatus(body, true);
  }

  @Post('webhook-payment-failed')
  async failedPayment(@Body() body: Stripe.Event) {
    return await this.StripeService.updatePremiumStatus(body, false);
  }
}
