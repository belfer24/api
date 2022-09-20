import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { StripeService } from './stripe.service';
import { HttpException } from '@nestjs/common/exceptions';
import { IStripeWebhook } from './stripe.interface';
import { CreatePortalDto } from './dto/stripe.dto';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  constructor(private StripeService: StripeService) {}

  @Post('create-portal')
  async createPortal(
    @Body() createPortalDto: CreatePortalDto,
    @Res() res: Response,
  ) {
    const redirectLink = await this.StripeService.createStripeProtal(
      createPortalDto.email,
    );

    if (redirectLink) {
      return res.redirect(redirectLink);
    } else {
      throw new HttpException('Bad request', 400);
    }
  }
  // TODO: Подумать над безопасностью веб-хуков, что бы только страйп мог стучать по этим роутам
  @Post('webhook/customer-created')
  async HandleWebhookCustomerCreated(
    @Body() body: IStripeWebhook.Event<Stripe.Customer>,
  ) {
    return this.StripeService.HandleWebhookCustomerCreated(body);
  }

  @Post('webhook/subscription-deleted')
  async HandleWebhookSubscriptionDeleted(
    @Body() body: IStripeWebhook.Event<Stripe.Subscription>,
  ) {
    return this.StripeService.HandleWebhookSubscriptionDeleted(body);
  }

  @Post('webhook/invoice-succeeded')
  async HandleWebhookInvoiceSucceeded(
    @Body() body: IStripeWebhook.Event<Stripe.Invoice>,
  ) {
    return this.StripeService.HandleWebhookInvoiceSucceeded(body);
  }

  @Post('webhook/invoice-failed')
  async HandleWebhookInvoiceFailed(
    @Body() body: IStripeWebhook.Event<Stripe.Invoice>,
  ) {
    return this.StripeService.HandleWebhookInvoiceFailed(body);
  }
}
