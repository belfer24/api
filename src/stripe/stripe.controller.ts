import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  constructor(
    private StripeService: StripeService
  ) {}

  @Post('/create-portal')
  async createPortal(@Body() body: {email: string}, @Res() res: Response) {
    const redirectLink = await this.StripeService.createStripeProtal(body);

    return res.redirect(redirectLink);
  }

  @Post('/customer-created')
  async customerCreated(@Body() body: Stripe.CustomerCreateParams) {
    return await this.StripeService.customerCreated(body);
  }

  @Post('/update-subscription')
  async updateSubscription(@Body() body) {
    console.log(body);
    
    const customer = body.data.object;
    
    console.log("Update Subscription: ", body.data.object);
  }

  @Post('/payment-success')
  async successPayment(@Body() body) {
    const customer = body.data.object;
    return await this.StripeService.updatePremiumStatus(customer, true);
  }

  @Post('/payment-failed')
  async failedPayment(@Body() body) {
    const customer = body.data.object;
    return await this.StripeService.updatePremiumStatus(customer, false);
  }
}
