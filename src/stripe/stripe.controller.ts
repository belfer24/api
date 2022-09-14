import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { StripeService } from './stripe.service';
import { HttpException } from '@nestjs/common/exceptions';
import { IStripeWebhook } from './stripe.interface';
import { CreatePortalDto } from './dto/stripe.dto';

@Controller('stripe')
export class StripeController {
  constructor(private StripeService: StripeService) {}

  @Post('create-portal')
  async createPortal(@Body() createPortalDto: CreatePortalDto, @Res() res: Response) {
    const redirectLink = await this.StripeService.createStripeProtal(createPortalDto.email);

    if (redirectLink) {
      return res.redirect(redirectLink);
    } else {
      throw new HttpException('Bad request', 400)
    }
  }

  @Post('webhook-customer-created')
  async customerCreated(@Body() body: IStripeWebhook.Event) {
    return this.StripeService.HandleWebhookCustomerCreated(body)
  }

  @Post('webhook-subscription-deleted')
  async subscriptionDeleted(@Body() body: IStripeWebhook.Event) {
    return this.StripeService.setFreePlan(body);
  }

  @Post('webhook-update-subscription')
  async updateSubscription(@Body() body: IStripeWebhook.Event) {
    return this.StripeService.updatePremiumStatus(body, true);
  }

  @Post('webhook-payment-failed')
  async failedPayment(@Body() body: IStripeWebhook.Event) {
    this.StripeService.setFreePlan(body);
    return this.StripeService.updatePremiumStatus(body, false);
  }
}
