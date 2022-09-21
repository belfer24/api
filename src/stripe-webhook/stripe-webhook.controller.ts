import { Controller, Post, Body } from '@nestjs/common';
import { StripeWebhookService } from './stripe-webhook.service';
import { IStripeWebhook } from './stripe-webhook.interface';
import Stripe from 'stripe';

@Controller('stripe-webhook')
export class StripeWebhookController {
  constructor(private readonly stripeWebhookService: StripeWebhookService) {}

  @Post('customer-created')
  async HandleWebhookCustomerCreated(
    @Body() body: IStripeWebhook.Event<Stripe.Customer>,
  ) {
    return this.stripeWebhookService.HandleWebhookCustomerCreated(body);
  }

  @Post('subscription-deleted')
  async HandleWebhookSubscriptionDeleted(
    @Body() body: IStripeWebhook.Event<Stripe.Subscription>,
  ) {
    return this.stripeWebhookService.HandleWebhookSubscriptionDeleted(body);
  }

  @Post('invoice-succeeded')
  async HandleWebhookInvoiceSucceeded(
    @Body() body: IStripeWebhook.Event<Stripe.Invoice>,
  ) {
    return this.stripeWebhookService.HandleWebhookInvoiceSucceeded(body);
  }

  @Post('invoice-failed')
  async HandleWebhookInvoiceFailed(
    @Body() body: IStripeWebhook.Event<Stripe.Invoice>,
  ) {
    return this.stripeWebhookService.HandleWebhookInvoiceFailed(body);
  }
}
