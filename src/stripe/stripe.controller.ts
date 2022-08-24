import { Body, Controller, Post, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

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

  @Post('/customer-created')
  async customerCreated(@Body() body: Stripe.CustomerCreateParams) {
    return await this.StripeService.customerCreated(body);
  }

  @Post('/update-subscription')
  async updateSubscription(@Body() body) {
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
